const dedent = require('dedent')

// TODO: IK: consider prompting the user if they are creating this container through createType to select existing component, getter, actions to wire up to
module.exports = function (typeName) {
  return dedent`
    import { connect as connectFeathers } from 'feathers-action-react'
    import { compose } from 'recompose'

    import { actions as ${typeName}Actions } from '../../${typeName}/dux/${typeName}'

    import get${typeName}Props from '../getters/get${typeName}Props'
    import ${typeName} from '../components/${typeName}'

    export default compose(
      connectFeathers({
        selector: get${typeName}Props,
        actions: {
          ${typeName}Actions
        },
        query: []
      })
    )(${typeName})
  `
}
