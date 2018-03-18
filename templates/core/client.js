const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    const authentication = require('dogstack-agents/client')

    export default {
      services: [
        authentication
      ]
    }
  `
}
