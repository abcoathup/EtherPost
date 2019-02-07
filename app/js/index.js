import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

// import choo
var choo = require('choo')

// import template
import { main } from "./templates/main";

// initialize choo
var app = choo()

// Buffer for files
var buffer = require('buffer')

// Initialize IPFS
var IPFS = require('ipfs')
var node = new IPFS()

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
                console.log(result[0].hash)
            })
        }

        reader.readAsArrayBuffer(file)
    })
})

// create a route
app.route('/', main)

// start app
app.mount('div')

