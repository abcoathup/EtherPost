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
        <div>${state.account}</div>
        <form onsubmit="${onUpload}" method="post">
            <label for="picture">Upload:</label><br>
            <input type="file" id="picture" name="picture" accept="image/gif, image/jpeg, image/png">
            <input type="submit" value="Add">
        </form>
        <br />
        ${state.uploads.map(upload)}
    </div>`

    function onUpload(e) {
        e.preventDefault()
        var picture = document.getElementById('picture').files[0];
        emit('upload', picture)
    }

    function onClap(e) {
        e.preventDefault()
        var ipfsHash = e.target.parentNode.parentNode.id;       
        emit('clap', ipfsHash)
    }

    function onComment(e) {
        e.preventDefault()
        var ipfsHash = e.target.name;
        var comment = e.target.comment.value;
        var data = { ipfsHash: ipfsHash, comment: comment };
        emit('comment', data)
    }

    function upload(upload, i) {
        return uploadTemplate(upload, onClap, onComment)
    }
}