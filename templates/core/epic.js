const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { combineEpics } from 'redux-observable'

    import { epic as agents } from 'dogstack-agents'

    export default combineEpics(
      agents
    )
  `
}
