var html = require('choo/html')

module.exports = function (comment) {
  
  // create html template
  return html`
  <div class="w3-panel w3-pale-blue">
    ${comment}
  </div>
  `
}