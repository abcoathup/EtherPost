// import choo's template helper
var html = require('choo/html')

var uploadTemplate = require('./upload.js')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
module.exports = function (state, emit) {
    return html `
    <div>
        <h2>Ether Post</h2>
        <form onsubmit="${upload}" method="post">
            <label for="picture">Upload:</label><br>
            <input type="file" id="picture" name="picture" accept="image/gif, image/jpeg, image/png">
            <input type="submit" value="Add">
        </form>
        <br />
        ${ // use reverse to display newest first
            state.uploads.reverse().map(uploadTemplate)
        }
    </div>`

    function upload(e) {
        e.preventDefault()
        var picture = document.getElementById('picture').files[0];
        emit('upload', picture)
    }
}