var html = require('choo/html')

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

  </div>

  `
}