const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    export default (state) => state.${topic}
  `
}
