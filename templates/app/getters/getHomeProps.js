const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { createStructuredSelector } from 'reselect'

    import getConfig from './getConfig'

    export default createStructuredSelector({
      config: getConfig
    })
  `
}
