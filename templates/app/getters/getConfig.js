const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { prop } from 'ramda'

    const getConfig = prop('config')

    export default getConfig
  `
}
