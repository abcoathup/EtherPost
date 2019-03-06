var html = require('choo/html')

module.exports = function (post) {
  var ipfsUrl = post.ipfsUrl;

  // create html template
  return html`
  <div>
    <div>
      <img src="${post.ipfsUrl}" />
    </div>
  </div>

  `
}