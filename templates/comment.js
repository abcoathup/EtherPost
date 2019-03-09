var html = require('choo/html')

module.exports = function (comment) {
  
  // create html template
  return html`
  <div class="w3-container">
    ${comment}
   </div>
  <hr class="w3-clear">
  `
}