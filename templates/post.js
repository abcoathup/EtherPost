var html = require('choo/html')

module.exports = function (post) {
  var ipfsUrl = post.ipfsUrl;

  // create html template
  return html`
  <a href="${post.ipfsUrl}"><img src="${post.ipfsUrl}" /></a>

  `
}