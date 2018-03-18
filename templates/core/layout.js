const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import Layout from './app/containers/Layout'
    export default Layout
  `
}
