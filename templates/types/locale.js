const dedent = require('dedent')

module.exports = function (typeName) {
  return dedent`
    export default {
      en: {
        "${typeName}.name": "${typeName}"
      }
    }
  `
}
