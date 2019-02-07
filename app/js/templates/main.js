// import choo's template helper
var html = require('choo/html')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
export const main = function (state, emit) {
    let image
    if (state.ipfsUrl) {
        image = html `<a href="${state.ipfsUrl}"><img src="${state.ipfsUrl}" /></a>`
    }

    return html `
    <div>
        <h2>Ether Post</h2>
        <form onsubmit="${upload}" method="post">
            <label for="file">Upload:</label><br>
            <input type="file" id="file" name="file" accept="image/gif, image/jpeg, image/png">
            <input type="submit" value="Add">
        </form>
        <br />
        ${image}
    </div>`

    function upload(e) {
        e.preventDefault()
        var file = document.getElementById('file').files[0];
        console.log(file)
        emit('upload', file)
    }
}