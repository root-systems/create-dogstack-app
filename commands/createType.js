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

const knexMigrationDate = require('./helpers/knexMigrationDate')
const getWiringFunctions = require('./helpers/getWiringFunctions')

/*
- Creates a type file
*/

module.exports = function createType ({ typeName, typeDir, typeType, topicName, appDir }) {
  return function (cb) {
    if (typeType && !includes(templateOptions, typeType)) {
      cb(new Error(`${typeType} is an unsupported type: please pick one of ${templateOptions.join(', ')}`))
    } else if (!typeName) {
      appDir = process.cwd()

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
            name: 'typeType',
            message: "Which type?",
            choices: templateOptions
          }
        ])
        .then(function (answers) {
          typeType = answers.typeType

          // special case for migrations
          if (typeType === 'migration') return { whichTopic: 'db' }

          return inquirer.prompt([{
            type: 'list',
            name: 'whichTopic',
            message: "Which topic? (if the choices don't make sense, make sure you are running create-dogstack-app from your app's root directory)",
            choices: topics
          }])
        })
        .then(function (answers) {
          topicName = answers.whichTopic
          const typeDirName = typeType === 'dux' ? typeType : typeType + 's' // pluralize folder names
          typeDir = path.join(appDir, topicName, typeDirName)
          return inquirer.prompt([{
            type: 'input',
            name: 'typeName',
            message: `What's the name of the ${answers.typeType}?`,
            validate: (answer) => answer.length >= 1
          }])
        })
        .then(function (answers) {
          // special case for migrations
          // TODO: IK: ideally use the db adaptor lib to create the migration rather than manually like this
          if (typeType === 'migration') {
            typeName = `${knexMigrationDate()}_${answers.typeName}`
          } else {
            typeName = answers.typeName
          }

          createType({ typeName, typeDir, typeType, topicName, appDir })(cb)
        })
      })
    } else {
      const templateFn = typesTemplates[typeType]
      const template = typeType === 'migration' ? templateFn(topicName) : templateFn(typeName)
      const fileName = typeType === 'getter' ? `get${capitalize(typeName)}Props.js` : `${typeName}.js`
      const wiringFuncs = getWiringFunctions({ typeName, typeType, topicName, appDir })
      const filePath = path.join(typeDir, fileName)

      parallel(wiringFuncs.concat([
        function (cb) {
          fs.writeFile(filePath, template, function (err) {
            if (err) return cb(err)
            cb(null)
          })
        }
      ]), cb)
    }
  }
}
