const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    web: npm run start:api
  `
}
