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
  <div id="${ipfsHash}" class="w3-container w3-card w3-white w3-round w3-margin">
    <br />
    <span class="w3-right w3-tiny w3-opacity">${ipfsHash}</span>
    <hr class="w3-clear">
    <img src="${ipfsUrl}" style="width:100%" class="w3-margin-bottom">
    <div class="w3-container">
      <button onclick="${clap}" type="button" class="w3-button w3-right w3-theme-d1 w3-margin-bottom"><i class="fa fa-hand-paper-o"></i>  Clap<span class="w3-badge w3-right w3-margin-left w3-blue">${clapCount}</span></button> 
    </div>
    <form class="w3-container" name="${ipfsHash}" onsubmit="${comment}" method="post">
      <div class="w3-row w3-section">
        <div class="w3-threequarter">
          <input class="w3-input w3-border" type="text" id="comment" name="comment" placeholder="Comment something nice">
        </div>
        <div class="w3-rest">
          <input class="w3-button w3-theme w3-right" type="submit" value="Comment">
        </div>
      </div>
    </form>
    <div class="w3-row w3-margin-bottom">
      ${upload.comments.map(commentTemplate)}
    </div>
  </div>  
  `
}