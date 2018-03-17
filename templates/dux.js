const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import createModule from 'feathers-action'

    const module = createModule('${topic}')

    export const actions = module.actions
    export const updater = module.updater
    export const epic = module.epic
  `
}
