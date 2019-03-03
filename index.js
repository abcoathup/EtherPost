//import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
//import EtherPost from 'Embark/contracts/EtherPost';

// import web3
//var Web3 = require('web3')

// import choo
var choo = require('choo')

// import template
var main = require('./templates/main');

// initialize choo
var app = choo()

// Buffer for files
var buffer = require('buffer')

// Initialize IPFS
var IPFS = require('ipfs-http-client')
var node = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

app.use(function (state, emitter) {
    emitter.on('upload', function (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const buf = buffer.Buffer(reader.result)
            node.add(buf, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                state.ipfsUrl = `https://ipfs.io/ipfs/${result[0].hash}`
                console.log(state.ipfsUrl)
                emitter.emit('render')
            })
        }

        reader.readAsArrayBuffer(file)
    })
})

// create a route
app.route('/', main)

// start app
app.mount('div')

