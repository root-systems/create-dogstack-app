const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    [build]
      publish = "dist"
      command = "npm run build"
  `
}
