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
  <button type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="fa fa-thumbs-up"></i>  Like</button> 
  <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comment</button> 
  <div><span onclick="${clap}">Clap</span>${clapCount}</div>
  <div><span>Comment</span>${commentCount}</div>
  <form name="${ipfsHash}" onsubmit="${comment}" method="post">
    <label for="comment">Comment:</label>
    <input type="text" id="comment" name="comment">
    <input type="submit" value="Comment">
  </form>
  ${upload.comments.map(commentTemplate)}

  <div class="w3-dropdown-hover w3-hide-small">
        <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
        <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px">
          <a href="#" class="w3-bar-item w3-button">One new friend request</a>
          <a href="#" class="w3-bar-item w3-button">John Doe posted on your wall</a>
          <a href="#" class="w3-bar-item w3-button">Jane likes your post</a>
        </div>
      </div>


  </div>  
  `
}