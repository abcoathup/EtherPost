// import choo's template helper
var html = require('choo/html')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
export const main = function (state, emit) {
    return html `
    <div>
        <h1>Ether Post</h1>
        <form onsubmit="${upload}" method="post">
            <label for="file">Upload:</label><br>
            <input type="file" id="file" name="file">
            <input type="submit" value="Add">
        </form>
    </div>`

    function upload(e) {
        e.preventDefault()
        var file = document.getElementById('file').files[0];
        console.log(file)
        emit('upload', file)
    }
}