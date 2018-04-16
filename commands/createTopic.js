const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const series = require('run-series')
const bulk = require('bulk-require')
const map = require('lodash/map')

const createType = require('./createType')
const typesTemplatesDir = path.resolve(__dirname, '../templates/types')
const typesTemplates = bulk(typesTemplatesDir, '*.js')

/*
- Creates a topic folder
- Creates the basic type files for a topic
- If the topic is being created inside a standard dogstack app (with standard files / paths), wire up certain files to their top-level collections (i.e. service, updater, epic, actions, routes)

N.B.
- May be called by createApp.
*/

module.exports = function createTopic ({ topicName, appDir, dir }) {
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
        dir = path.relative(process.cwd(), topicName)
        appDir = process.cwd()
        createTopic({ topicName, appDir, dir })(cb)
      })
    } else {
      if (!appDir) appDir = process.cwd()
      if (!dir) dir = path.relative(appDir, topicName)

      mkdirp(dir, function (err) {
        if (err) {
          cb(err)
        } else {
          parallel(
            map(typesTemplates, (templateFn, whichType) => {
              if (whichType === 'migration') return createMigration({ appDir, whichType, topicName, templateFn })
              return createTypeFolder({ appDir, whichType, dir, topicName, templateFn })
            }),
            cb
          )
        }
      })
    }
  }
}

/*
create a folder for types (i.e. containers, components)
no real reason to create the folder without also creating a standard type to go in it?
*/

function createTypeFolder ({ appDir, whichType, dir, topicName, templateFn }) {
  return function (cb) {
    const folderName = whichType === 'dux' ? whichType : whichType + 's' // pluralize folder names
    const folderPath = path.join(dir, folderName)
    mkdirp(folderPath, function (err) {
      if (err) cb(err)
      createType({ appDir, whichType, folderName, folderPath, topicName, template: templateFn(topicName), typeName: topicName })(cb)
    })
  }
}

// TODO: IK: break this out into a helper somewhere and use it in createType
function createMigration ({ appDir, whichType, topicName, templateFn }) {
  return function (cb) {
    if (topicName === 'app') return cb(null) // early cb if app topic, no need for migration
    const folderName = 'migrations'
    const folderPath = path.join(appDir, 'db', folderName)
    const typeName = `${yyyymmddhhmmss()}_create-${topicName}-table`
    createType({ appDir, whichType, folderName, folderPath, topicName, template: templateFn(topicName), typeName })(cb)
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
