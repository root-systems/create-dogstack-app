const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const bulk = require('bulk-require')
const map = require('lodash/map')

const createTopic = require('./createTopic')
const coreTemplatesDir = path.resolve(__dirname, '../templates/core')
const coreTemplates = bulk(coreTemplatesDir, '*.js')

/*
- Creates a folder for a dogstack app
- Creates the basic sub-folders and files (including top-level files and 'app' folder + files)
- Installs the modules specified in the basic package.json
- App should be ready to run
*/

module.exports = function createApp ({ appName, dir }) {
  return function (cb) {
    if (!appName) {
      inquirer.prompt([{
        type: 'input',
        name: 'input',
        message: "What's the app's name?",
        validate: (answer) => answer.length >= 1
      }])
      .then(function (answers) {
        appName = answers.input
        createApp({ appName, dir })(cb)
      })
    } else {
      if (!dir) dir = path.relative(process.cwd(), appName)

      mkdirp(dir, function (err) {
        if (err) {
          cb(err)
        } else {
          const topicName = 'dogs'
          // // TODO: IK: currently the app topic won't have locales, favicon.ico, themes etc... need to think about how to create them / where to put them
          parallel([
            createTopic({ topicName: 'app', dir: path.join(dir, 'app') }),
            createTopic({ topicName, dir: path.join(dir, topicName) }),
            createCore({ topicName, dir })
          ], cb)
        }
      })
    }
  }
}

function createCore ({ topicName, dir }) {
  return function (cb) {
    parallel(
      map(coreTemplates, (templateFn, name) => {
        return function (cb) {
          const filePath = path.join(dir, `${name}.js`)
          const template = templateFn(topicName)
          fs.writeFile(filePath, template, function (err) {
            if (err) return cb(err)
            cb(null, name)
          })
        }
      }),
      cb
    )
  }
}
