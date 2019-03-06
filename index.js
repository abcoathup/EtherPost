// import choo
var choo = require('choo')
// import template
var main = require('./templates/main');
// import web3
var Web3 = require('web3')
// Import contract ABI
var contractABI = require("./dist/contracts/EtherPost.json").abiDefinition
// Buffer for files
var buffer = require('buffer')
// bs58
var bs58 = require('bs58')

// initialize choo
var app = choo()

// Initialize IPFS
var IPFS = require('ipfs-http-client')
var node = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

app.use(function (state, emitter) {

    state.uploads = [];

    emitter.on('DOMContentLoaded', async () => {
        // Check for web3 instance. Create if necessary.
        // Access MetaMask
        if (window.ethereum) {
            try {
                await window.ethereum.enable()
            } catch (error) {
                console.log(error)
            }
        }

        // Set up web3 provider
        web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8555'));

        // Set up contract interface
        state.contractInstance = new web3.eth.Contract(contractABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")
        await getUploads(state);
        emitter.emit('render')

        state.contractInstance.events.LogUpload((err, event) => {
            if (err) {
              // something went wrong
              console.log(err);
            } 
            const uploader = event.returnValues.uploader;
            var ipfsHash = getIpfsHashFromBytes32(event.returnValues.ipfsHash);
            
            console.log('LogUpload event: ', ipfsHash);

            var upload = { ipfsHash: ipfsHash, clapCount: 0, comments: [] };
            state.uploads.push(upload);
            emitter.emit('render')
        })

        // Unlock account
        const accounts = await web3.eth.getAccounts()
        web3.eth.personal.unlockAccount(accounts[0], async function (error, result) {
            if (error) {
                console.error(error)
            }
            else {
                web3.eth.defaultAccount = accounts[0]
            }
        });
    })

    emitter.on('upload', function (file) {
        console.log('Upload file: ', file)
        const reader = new FileReader();
        reader.onloadend = function () {
            const buf = buffer.Buffer(reader.result)
            node.add(buf, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                var ipfsHash = result[0].hash;
                
                state.contractInstance.methods.upload(getBytes32FromIpfsHash(ipfsHash)).send({ from: web3.eth.defaultAccount })
                .on('error', console.error)
                .on('receipt', async receipt => {
                    console.log("Saved post to smart contract: ", ipfsHash)
                })
            })
        }

        reader.readAsArrayBuffer(file)
    })

    emitter.on('clap', function (ipfsHash) {
        state.contractInstance.methods.clap(getBytes32FromIpfsHash(ipfsHash)).send({ from: web3.eth.defaultAccount })
            .on('error', console.error)
            .on('receipt', async receipt => {
                console.log("Saved clap to smart contract: ", ipfsHash)
            })
    })
})

// create a route
app.route('/', main)

// start app
app.mount('div')

// Return bytes32 hex string from IPFS hash
function getBytes32FromIpfsHash(ipfsHash) {
  return "0x" + bs58.decode(ipfsHash).slice(2).toString('hex')
 }
  
// Return base58 encoded ipfs hash from bytes32 hex string
function getIpfsHashFromBytes32(bytes32Hex) {
  // Add default ipfs values for first 2 bytes: function: 0x12=sha2, size: 0x20=256 bits
  // Cut off leading "0x"
  const hex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hex, 'hex');
  const str = bs58.encode(hashBytes)
  return str
}

function getClapCount(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getClapCount(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

function getUploadsForUser(state, user) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getUploads(user).call().then(function (response) {
            resolve(response);
        });
    });
}

async function getUploads(state) {
    const accounts = await web3.eth.getAccounts();
    var uploads = await getUploadsForUser(state, accounts[0]);
    
    uploads.forEach(function(item, index) {
        var ipfsHash = getIpfsHashFromBytes32(item);
        
        var upload = { ipfsHash: ipfsHash, clapCount: 0, comments: [] };
        state.uploads.push(upload);            
    });
}