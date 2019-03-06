var html = require('choo/html')

module.exports = function (comment) {
  
  // create html template
  return html`
  <div>
    ${comment}
  </div>
  `
}