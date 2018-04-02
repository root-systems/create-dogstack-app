const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    export default {
      container: (props) => ({}),
      labelText: () => ({
        textTransform: 'capitalize'
      })
    }
  `
}
