const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { connect as connectFeathers } from 'feathers-action-react'
    import { compose } from 'recompose'

    import { actions as ${topic}Actions } from '../../${topic}/dux/${topic}'

    import get${topic}Props from '../getters/get${topic}Props'
    import ${topic} from '../components/${topic}'

    export default compose(
      connectFeathers({
        selector: get${topic}Props,
        actions: {
          ${topic}Actions
        },
        query: []
      })
    )(${topic})
  `
}
