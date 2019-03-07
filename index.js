var choo = require('choo')
var main = require('./templates/main');
var Web3 = require('web3')
var contractABI = require("./dist/contracts/EtherPost.json").abiDefinition
var buffer = require('buffer')
var bs58 = require('bs58')
var IPFS = require('ipfs-http-client')

var app = choo()
var node = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

app.use(function (state, emitter) {

    state.uploads = [];

    emitter.on('DOMContentLoaded', async () => {
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected.');
            // Set up web3 provider
            window.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8555'));
        }        

        ethereum.on('accountsChanged', function (accounts) {
            window.web3.eth.defaultAccount = accounts[0]
            state.account = window.web3.eth.defaultAccount;
            emitter.emit('render');
        })

        // Set up contract interface
        state.contractInstance = new window.web3.eth.Contract(contractABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")

        var accounts = await window.web3.eth.getAccounts()
        window.web3.eth.defaultAccount = accounts[0]
        state.account = window.web3.eth.defaultAccount;
        emitter.emit('render');

        // Unlock account only for ganache
        window.web3.eth.personal.unlockAccount(state.account, async function (error, result) {
            if (error) {
                console.error(error)
            }
            else {
                console.log("Unlocked account: ", state.account);
            }
        });
        
        // set state uploads first to display
        await setStateUploads(state);
        emitter.emit('render');

        // set state claps and comments
        await setStateClapsAndComments(state);
        emitter.emit('render');

        // Test upload
        var upload = { ipfsHash: "Qma6e8dovfLyiG2UUfdkSHNPAySzrWLX9qVXb44v1muqcp", clapCount: 0, comments: [] };
        state.uploads.push(upload);

        // Listen for LogUpload smart contract event and update dApp with upload
        state.contractInstance.events.LogUpload(async (err, event) => {
            if (err) {
              console.log(err);
            } 
            
            const uploader = event.returnValues.uploader;
            var ipfsHash = getIpfsHashFromBytes32(event.returnValues.ipfsHash);
            
            await setStateUpload(state, ipfsHash);

            emitter.emit('render')
        })
        
        // Listen for LogUpload smart contract event and update dApp with clap
        state.contractInstance.events.LogClap(async (err, event) => {
            if (err) {
              console.log(err);
            } 
            
            const clapper = event.returnValues.clapper;
            var ipfsHash = getIpfsHashFromBytes32(event.returnValues.ipfsHash);
            
            await setStateClapCount(state, ipfsHash);
            
            emitter.emit('render')
        })

        // Listen for LogComment smart contract event and update dApp with comment
        state.contractInstance.events.LogComment(async (err, event) => {
            if (err) {
              console.log(err);
            } 

            const commenter = event.returnValues.commenter;
            var imageHash = getIpfsHashFromBytes32(event.returnValues.imageHash);
            var commentHash = getIpfsHashFromBytes32(event.returnValues.commentHash);
            const timestamp = event.returnValues.timestamp;
            
            await setStateComments(state, imageHash);
            
            emitter.emit('render')
        })
    })

    // Listen for upload dApp event and save upload to smart contract
    emitter.on('upload', function (file) {
        console.log('Upload file to IPFS: ', file.name)
        const reader = new FileReader();
        reader.onloadend = function () {
            const buf = buffer.Buffer(reader.result)
            node.add(buf, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                var ipfsHash = result[0].hash;
                
                state.contractInstance.methods.upload(getBytes32FromIpfsHash(ipfsHash)).send({ from: state.account })
                .on('error', console.error)
                .on('receipt', async receipt => {
                    console.log("Saved upload to smart contract with ipfsHash: ", ipfsHash)
                })
            })
        }

        reader.readAsArrayBuffer(file)
    })

    // Listen for clap dApp event and save clap to smart contract
    emitter.on('clap', function (ipfsHash) {
        state.contractInstance.methods.clap(getBytes32FromIpfsHash(ipfsHash)).send({ from: state.account })
            .on('error', console.error)
            .on('receipt', async receipt => {
                console.log("Saved clap to smart contract for upload with ipfsHash: ", ipfsHash)
            })
    })

    // Listen for comment dApp event and save comment to smart contract
    emitter.on('comment', function (data) {
        var imageHash = data.ipfsHash;
        console.log('Upload comment to IPFS: ', data.comment)

        const buf = buffer.Buffer(data.comment)
        node.add(buf, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            var commentHash = result[0].hash;
                
            state.contractInstance.methods.comment(getBytes32FromIpfsHash(imageHash), getBytes32FromIpfsHash(commentHash)).send({ from: window.web3.eth.defaultAccount })
                .on('error', console.error)
                .on('receipt', async receipt => {
                    console.log("Saved comment to smart contract with ipfsHash: ", commentHash)
            })
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

// Return clap count from smart contract for given upload ipfsHash
function getClapCount(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getClapCount(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

// Return comments from smart contract for given upload ipfsHash
function getComments(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getComments(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

// Return uploads from smart contract for given user
function getUploadsForUser(state, user) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getUploads(user).call().then(function (response) {
            resolve(response);
        });
    });
}

async function setStateUploads(state) {
    var uploads = await getUploadsForUser(state, state.account);
    
    uploads.forEach(function(item, index) {
        var ipfsHash = getIpfsHashFromBytes32(item);
        
        var upload = { ipfsHash: ipfsHash, clapCount: 0, comments: [] };
        state.uploads.push(upload);            
    });    
}

async function setStateUpload(state, ipfsHash) {
    var exists = false;
    for(var index = 0; index < state.uploads.length; index++) {
        if (state.uploads[index].ipfsHash == ipfsHash) {
            exists = true;
        }
    }

    if(!exists) {
        var upload = { ipfsHash: ipfsHash, clapCount: 0, comments: [] };
        state.uploads.push(upload);
    }
}

async function setStateClapCount(state, ipfsHash) {
    var clapCount = await getClapCount(state, ipfsHash);
    for(var index = 0; index < state.uploads.length; index++) {
        if (state.uploads[index].ipfsHash == ipfsHash) {
            state.uploads[index].clapCount = clapCount;
        }
    }
}

async function setStateComments(state, imageHash) {
    var commentsIpfsHashes = await getComments(state, imageHash);
    var comments = [];

    for(var commentIndex = 0; commentIndex < commentsIpfsHashes.length; commentIndex++) {
        var commentIpfsHash = getIpfsHashFromBytes32(commentsIpfsHashes[commentIndex]);
        
        var commentEncoded = await node.cat(commentIpfsHash)
        var comment = commentEncoded.toString('utf8')
        comments.push(comment)
    }

    for(var index = 0; index < state.uploads.length; index++) {
        if (state.uploads[index].ipfsHash == imageHash) {
            state.uploads[index].comments = comments;
        }
    }
}

async function setStateClapsAndComments(state) {
    for(var index = 0; index < state.uploads.length; index++) {
        var clapCount = await getClapCount(state, state.uploads[index].ipfsHash);
        var commentsIpfsHashes = await getComments(state, state.uploads[index].ipfsHash)
        var comments = [];

        for(var commentIndex = 0; commentIndex < commentsIpfsHashes.length; commentIndex++) {
            var commentIpfsHash = getIpfsHashFromBytes32(commentsIpfsHashes[commentIndex]);
            
            var commentEncoded = await node.cat(commentIpfsHash)
            var comment = commentEncoded.toString('utf8')
            comments.push(comment)
        }

        state.uploads[index].clapCount = clapCount;
        state.uploads[index].comments = comments;
    }
}

