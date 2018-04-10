const dedent = require('dedent')

module.exports = function (typeName) {
  return dedent`
    import createModule from 'feathers-action'

    const module = createModule('${typeName}')

    export const actions = module.actions
    export const updater = module.updater
    export const epic = module.epic
  `
}
