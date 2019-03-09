var choo = require('choo')
var main = require('./templates/main');
var Web3 = require('web3')
var etherPostABI = require("./dist/contracts/EtherPost.json").abiDefinition
var buffer = require('buffer')
var bs58 = require('bs58')
var IPFS = require('ipfs-http-client')

var app = choo()
var node = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

app.use(function (state, emitter) {

    state.uploads = [];

    emitter.on('DOMContentLoaded', async () => {
        // Set up web3 provider
        var useMetaMask = false;
        if (useMetaMask) {
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected.');
            }        
        } else {
            window.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8555'));
        }

        ethereum.on('accountsChanged', async function (accounts) {
            window.web3.eth.defaultAccount = accounts[0]
            state.account = window.web3.eth.defaultAccount;
            state.name = await getName(state);
            emitter.emit('render');
        })

        // Set up contract interface
        state.etherPostContract = new window.web3.eth.Contract(etherPostABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")
        state.etherPostContract.options.gas = 5000000; 

        var accounts = await window.web3.eth.getAccounts()
        window.web3.eth.defaultAccount = accounts[0]
        state.account = window.web3.eth.defaultAccount;
        state.name = await getName(state);
            
        emitter.emit('render');

        // Unlock account only for ganache
        if(!useMetaMask) {
            web3.eth.personal.unlockAccount(state.account, async function (error, result) {
                if (error) {
                    console.error(error)
                }
                else {
                    console.log("Unlocked account: ", state.account);
                }
            });
        }

        // set state uploads 
        await setStateUploads(state);

        // set state upload data (uploader, claps and comments)
        await setStateUploadData(state);
        emitter.emit('render');

        // Listen for LogUpload smart contract event and update dApp with upload
        state.etherPostContract.events.LogUpload(async (err, event) => {
            if (err) {
              console.log(err);
            } 
            
            console.log(event.returnValues.ipfsHash);

            const uploader = event.returnValues.uploader;
            var ipfsHash = getIpfsHashFromBytes32(event.returnValues.ipfsHash);
            
            await setStateUpload(state, ipfsHash);

            emitter.emit('render')
        })
        
        // Listen for LogUpload smart contract event and update dApp with clap
        state.etherPostContract.events.LogClap(async (err, event) => {
            if (err) {
              console.log(err);
            } 
            
            const clapper = event.returnValues.clapper;
            var ipfsHash = getIpfsHashFromBytes32(event.returnValues.ipfsHash);
            
            await setStateClapCount(state, ipfsHash);
            
            emitter.emit('render')
        })

        // Listen for LogComment smart contract event and update dApp with comment
        state.etherPostContract.events.LogComment(async (err, event) => {
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
                
                state.etherPostContract.methods.upload(getBytes32FromIpfsHash(ipfsHash)).send({ from: state.account })
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
        state.etherPostContract.methods.clap(getBytes32FromIpfsHash(ipfsHash)).send({ from: state.account })
            .on('error', console.error)
            .on('receipt', async receipt => {
                console.log("Saved clap to smart contract for upload with ipfsHash: ", ipfsHash)
            })
    })

    emitter.on('setName', function (name) {
        state.etherPostContract.methods.register(name).send({ from: state.account })
            .on('error', console.error)
            .on('receipt', async receipt => {
                console.log("Registered name to smart contract: ", name);
                //Could create a smart contract event to trigger
                state.name = name;
                emitter.emit('render')
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
                
            state.etherPostContract.methods.comment(getBytes32FromIpfsHash(imageHash), getBytes32FromIpfsHash(commentHash)).send({ from: state.account })
                .on('error', console.error)
                .on('receipt', async receipt => {
                    console.log("Saved comment to smart contract with ipfsHash: ", commentHash)
            })
        })
    })
})

// create a route
app.route('/', main)
app.route('/uploader/:uploader', main)

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

function getUploaderData(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getUploaderData(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

// Return clap count from smart contract for given upload ipfsHash
function getClapCount(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getClapCount(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

// Return comments from smart contract for given upload ipfsHash
function getComments(state, ipfsHash) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getComments(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
            resolve(response);
        });
    });
}

// Return uploads from smart contract for given user
function getUploadsForUser(state, user) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getUploads(user).call().then(function (response) {
            resolve(response);
        });
    });
}

function getAllUploads(state) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getAllUploads().call().then(function (response) {
            resolve(response);
        });
    });
}

function getName(state) {
    return new Promise(function (resolve, reject) {
        state.etherPostContract.methods.getName(state.account).call().then(function (response) {
            resolve(response);
        });
    });
}

async function setStateUploads(state) {
    var uploads = await getAllUploads(state);
    
    uploads.forEach(function(item, index) {
        var ipfsHash = getIpfsHashFromBytes32(item);

        var upload = { ipfsHash: ipfsHash, uploaderAddress: null, uploaderName: "", clapCount: 0, comments: [] };
        state.uploads.push(upload);            
    });    
}

// Only store uploads initially, second pass will get claps and comments
async function setStateUpload(state, ipfsHash) {
    var exists = false;
    for(var index = 0; index < state.uploads.length; index++) {
        if (state.uploads[index].ipfsHash == ipfsHash) {
            exists = true;
        }
    }

    if(!exists) {
        var uploader = await getUploaderData(state, ipfsHash);
        var upload = { ipfsHash: ipfsHash, uploaderAddress: uploader.uploader, uploaderName: uploader.name, clapCount: 0, comments: [] };
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

async function setStateUploadData(state) {
    for(var index = 0; index < state.uploads.length; index++) {
        var uploader = await getUploaderData(state, state.uploads[index].ipfsHash);
        var clapCount = await getClapCount(state, state.uploads[index].ipfsHash);
        var commentsIpfsHashes = await getComments(state, state.uploads[index].ipfsHash)
        var comments = [];

        for(var commentIndex = 0; commentIndex < commentsIpfsHashes.length; commentIndex++) {
            var commentIpfsHash = getIpfsHashFromBytes32(commentsIpfsHashes[commentIndex]);
            
            var commentEncoded = await node.cat(commentIpfsHash)
            var comment = commentEncoded.toString('utf8')
            comments.push(comment)
        }

        state.uploads[index].uploaderAddress = uploader.uploader;
        state.uploads[index].uploaderName = uploader.name;
        state.uploads[index].clapCount = clapCount;
        state.uploads[index].comments = comments;
    }
}

