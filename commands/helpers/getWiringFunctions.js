const wireTypeToUpdater = require('../wiring/updater')
const wireTypeToEpic = require('../wiring/epic')
const wireTypeToIntl = require('../wiring/intl')
const wireTypeToServer = require('../wiring/server')

module.exports = function getWiringFunctions ({ typeName, typeType, topicName, appDir }) {
  switch (typeType) {
    case 'dux':
      return [
        wireTypeToEpic({ appDir, topicName, typeName }),
        wireTypeToUpdater({ appDir, topicName, typeName })
      ]
    case 'locale':
      return [wireTypeToIntl({ appDir, topicName, typeName })]
    case 'service':
      return [wireTypeToServer({ appDir, topicName, typeName })]
    // TODO: IK: case 'routes'
    // TODO: IK: case 'container' into own topic routes.js file? as an option to the user?
    default:
      return []
  }
}
