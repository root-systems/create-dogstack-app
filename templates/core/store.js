const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import updater from './updater'
    import epic from './epic'

    export default {
      updater,
      epic
    }
  `
}
