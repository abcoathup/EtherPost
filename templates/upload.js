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
  <br>
  <img src="/w3images/avatar5.png" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
  <span class="w3-right w3-opacity">16 min</span>
  <h4>Jane Doe</h4><br>
  <hr class="w3-clear">
  <img src="${ipfsUrl}" style="width:100%" class="w3-margin-bottom">
  <button onclick="${clap}" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="fa fa-hand-paper-o"></i>  Clap<span class="w3-badge w3-right w3-small w3-green">${clapCount}</span></button> 
  <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comment<span class="w3-badge w3-right w3-small w3-green">${commentCount}</span></button> 
  
  <form name="${ipfsHash}" onsubmit="${comment}" method="post">
    <label for="comment">Comment:</label>
    <input type="text" id="comment" name="comment">
    <input type="submit" value="Comment">
  </form>
  ${upload.comments.map(commentTemplate)}
  </div>  
  `
}