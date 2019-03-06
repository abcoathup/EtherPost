var html = require('choo/html')

module.exports = function (upload) {
  var ipfsHash = upload.ipfsHash;
  var comments = upload.comments;
  var commentCount = comments.length;
  var clapCount = upload.clapCount;
  var ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`

  // create html template
  return html`
  <div>
    <div>
      <img src="${ipfsUrl}" />
    </div>
    <div>${clapCount}</div>
    <div>${commentCount}</div>
  </div>

  `
}