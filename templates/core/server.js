const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    const services = [
      require('dogstack-agents/service')
    ]

    export default {
      services
    }
  `
}
