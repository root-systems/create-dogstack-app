const inquirer = require('inquirer')
const path = require('path')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const series = require('run-series')
const bulk = require('bulk-require')
const map = require('lodash/map')
const filter = require('lodash/filter')

const createType = require('./createType')
const typesTemplatesDir = path.resolve(__dirname, '../templates/types')
const typesTemplates = bulk(typesTemplatesDir, '*.js')
const typeTypes = map(typesTemplates, (templateFn, typeType) => typeType)

const knexMigrationDate = require('./helpers/knexMigrationDate')

/*
- Creates a topic folder
- Creates the basic type files for a topic
- If the topic is being created inside a standard dogstack app (with standard files / paths), wire up certain files to their top-level collections (i.e. service, updater, epic, actions, routes)

N.B.
- May be called by createApp.
*/

module.exports = function createTopic ({ topicName, topicDir, appDir }) {
  return function (cb) {
    if (!topicName) {
      inquirer.prompt([{
        type: 'input',
        name: 'input',
        message: "What's the topic's name?",
        validate: (answer) => answer.length >= 1
      }])
      .then(function (answers) {
        topicName = answers.input
        topicDir = path.relative(process.cwd(), topicName)
        appDir = process.cwd()
        createTopic({ topicName, topicDir, appDir })(cb)
      })
    } else {
      if (!appDir) appDir = process.cwd()
      if (!topicDir) topicDir = path.relative(appDir, topicName)

      mkdirp(topicDir, function (err) {
        if (err) {
          cb(err)
        } else {
          const typeFolders = filter(typeTypes, (typeType) => typeType !== 'migration')
          parallel([
            function (cb) {
              parallel(
                map(typeFolders, (typeType) => {
                  // create folders for the types, then the types themselves
                  const typeDirName = typeType === 'dux' ? typeType : typeType + 's' // pluralize folder names
                  const typeDir = path.join(topicDir, typeDirName)
                  return function (cb) {
                    series([
                      function (cb) {
                        mkdirp(typeDir, function (err) {
                          if (err) {
                            cb(err)
                          } else {
                            cb(null)
                          }
                        })
                      },
                      createType({ typeName: topicName, typeDir, typeType, topicName, appDir })
                    ], cb)
                  }
                }),
                cb
              )
            },
            function (cb) {
              if (topicName === 'app') return cb(null) // early cb if app topic, no need for migration
              const typeType = 'migration'
              const typeDir = path.join(appDir, 'db', 'migrations')
              const typeName = `${knexMigrationDate()}_create-${topicName}-table`
              createType({ typeName, typeDir, typeType, topicName, appDir })(cb)
            }
          ], cb)
        }
      })
    }
  }
}
