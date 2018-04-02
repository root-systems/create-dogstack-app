const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    const getState = state => state

    export default getState
  `
}
