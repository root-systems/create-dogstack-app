const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import h from 'react-hyperscript'

    export default (props) => {
      const { actions } = props

      return h('div', {}, [
        h('span', {}, 'A new ${topic} component!')
      ])
    }
  `
}
