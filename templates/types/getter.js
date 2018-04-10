const dedent = require('dedent')

module.exports = function (typeName) {
  return dedent`
    export default (state) => state.${typeName}
  `
}
