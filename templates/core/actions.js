const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    export { actions as dogs } from './dogs/dux/dogs'
  `
}
