const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    export default {
      container: (props) => ({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      })
    }
  `
}
