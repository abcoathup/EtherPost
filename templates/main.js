// import choo's template helper
var html = require('choo/html')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
module.exports = function (state, emit) {
    let image
    if (state.ipfsUrl) {
        image = html `<a href="${state.ipfsUrl}"><img src="${state.ipfsUrl}" /></a>`
    }

    return html `
    <div>
        <h2>Ether Post</h2>
        <form onsubmit="${upload}" method="post">
            <label for="picture">Upload:</label><br>
            <input type="file" id="picture" name="picture" accept="image/gif, image/jpeg, image/png">
            <input type="submit" value="Add">
        </form>
        <br />
        ${image}
    </div>`

    function upload(e) {
        e.preventDefault()
        var picture = document.getElementById('picture').files[0];
        console.log(picture)
        emit('upload', picture)
    }
}