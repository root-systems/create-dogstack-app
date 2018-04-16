const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const capitalize = require('lodash/capitalize')
const includes = require('lodash/includes')
const keys = require('lodash/keys')
const bulk = require('bulk-require')

const typesTemplatesDir = path.resolve(__dirname, '../templates/types')
const typesTemplates = bulk(typesTemplatesDir, '*.js')
const templateOptions = keys(typesTemplates)

const wireTypeToUpdater = require('./wiring/updater')
const wireTypeToEpic = require('./wiring/epic')
const wireTypeToIntl = require('./wiring/intl')
const wireTypeToServer = require('./wiring/server')

/*
- Creates a type file
*/

// TODO: IK: too many args here, probably a better more modular way
module.exports = function createType ({ appDir, whichType, folderName, folderPath, topicName, template, typeName }) {
  return function (cb) {
    if (whichType && !includes(templateOptions, whichType)) {
      cb(new Error(`${whichType} is an unsupported type: please pick one of ${templateOptions.join(', ')}`))
    } else if (!whichType) {
      const appDir = process.cwd()

      fs.readdir(appDir, function (err, files) {
        if (err) cb(err)

        const topicPaths = files
        .map((name) => path.join(appDir, name))
        .filter((file) => fs.lstatSync(file).isDirectory()) // TODO: IK: use async lstat?
        .filter((dir) => {
          const base = path.basename(dir)
          return base !== 'config' && base !== 'db' && base !== 'node_modules'
        })
        const topics = topicPaths.map((topicPath) => path.basename(topicPath))

        inquirer.prompt([
          {
            type: 'list',
            name: 'whichType',
            message: "Which type?",
            choices: templateOptions
          }
        ])
        .then(function (answers) {
          whichType = answers.whichType
          templateFn = typesTemplates[answers.whichType]

          // special case for migrations
          if (whichType === 'migration') {
            folderName = 'migrations'
            return { whichTopic: 'db' }
          }

          folderName = whichType === 'dux' ? whichType : whichType + 's' // pluralize folder names
          return inquirer.prompt([{
            type: 'list',
            name: 'whichTopic',
            message: "Which topic? (if the choices don't make sense, make sure you are running create-dogstack-app from your app's root directory)",
            choices: topics
          }])
        })
        .then(function (answers) {
          topicName = answers.whichTopic
          folderPath = path.join(appDir, topicName, folderName)
          return inquirer.prompt([{
            type: 'input',
            name: 'typeName',
            message: `What's the name of the ${answers.whichType}?`,
            validate: (answer) => answer.length >= 1
          }])
        })
        .then(function (answers) {
          // special case for migrations
          // TODO: IK: ideally use the db adaptor lib to create the migration rather than manually like this
          if (whichType === 'migration') {
            typeName = `${yyyymmddhhmmss()}_${answers.typeName}`
          } else {
            typeName = answers.typeName
          }

          createType({
            appDir,
            whichType,
            folderName,
            folderPath,
            topicName,
            template: templateFn(typeName),
            typeName
          })(cb)
        })
      })
    } else {
      // TODO: IK: fix this horrible mutative style along with everything else in this file when refactoring
      const fileName = whichType === 'getter' ? `get${capitalize(typeName)}Props.js` : `${typeName}.js`
      const wiringFuncs = determineWiringFuncs({ appDir, topicName, typeName, whichType })
      const filePath = path.join(folderPath, fileName)

      parallel(wiringFuncs.concat([
        function (cb) {
          fs.writeFile(filePath, template, function (err) {
            if (err) return cb(err)
            cb(null, folderName)
          })
        }
      ]), cb)
    }
  }
}

function determineWiringFuncs ({ appDir, topicName, typeName, whichType }) {
  switch (whichType) {
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

// borrowed from https://github.com/tgriesser/knex/blob/843a16799d465c3e65a58b1faab5e906f46c675b/src/migrate/index.js#L428
function yyyymmddhhmmss() {
  const d = new Date()
  return d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())

  function padDate(segment) {
    segment = segment.toString();
    return segment[1] ? segment : `0${segment}`;
  }
}
