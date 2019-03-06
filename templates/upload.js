var html = require('choo/html')

var commentTemplate = require('./comment.js')

module.exports = function (upload, clap, comment) {
  var ipfsHash = upload.ipfsHash;
  var comments = upload.comments;
  var commentCount = comments.length;
  var clapCount = upload.clapCount;
  var ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`

  // create html template
  return html`
  <div id="${ipfsHash}">
    <div>
      <img src="${ipfsUrl}" />
    </div>
    <div><span onclick="${clap}">Clap</span>${clapCount}</div>
    <div><span>Comment</span>${commentCount}</div>
    <form name="${ipfsHash}" onsubmit="${comment}" method="post">
      <label for="comment">Comment:</label>
      <input type="text" id="comment" name="comment">
      <input type="submit" value="Comment">
    </form>
    ${upload.comments.map(commentTemplate)}

  </div>

  `
}