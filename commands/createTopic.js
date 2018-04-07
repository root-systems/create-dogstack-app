const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
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

module.exports = function createTopic ({ topicName, dir }) {
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
        createTopic({ topicName, dir })(cb)
      })
    } else {
      if (!dir) dir = path.relative(process.cwd(), topicName)

      mkdirp(dir, function (err) {
        if (err) {
          cb(err)
        } else {
          parallel(
            map(typesTemplates, (templateFn, typeName) => {
              return createTypeFolder({ typeName, dir, topicName, templateFn })
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

function createTypeFolder ({ typeName, dir, topicName, templateFn }) {
  return function (cb) {
    const folderName = typeName === 'dux' ? typeName : typeName + 's' // pluralize folder names
    const folderPath = path.join(dir, folderName)
    mkdirp(folderPath, function (err) {
      if (err) cb(err)
      createType({ typeName, folderName, folderPath, topicName, template: templateFn(topicName) })(cb)
    })
  }
}
