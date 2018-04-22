const inquirer = require('inquirer')
const path = require('path')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const series = require('run-series')
const bulk = require('bulk-require')

const createTopic = require('./createTopic')
const coreTemplatesDir = path.resolve(__dirname, '../templates/core')
const coreTemplates = bulk(coreTemplatesDir, '**/*.js')

const createCore = require('./helpers/createCore')
const appendToAppTopic = require('./helpers/appendToAppTopic')
const runMigrations = require('./helpers/runMigrations')
const installPackages = require('./helpers/installPackages')

/*
- Creates a folder for a dogstack app
- Creates the basic sub-folders and files (including top-level files and 'app' folder + files)
- Installs the modules specified in the basic package.json
- App should be ready to run
*/

module.exports = function createApp ({ appName, appDir, doInstallPackages, doRunMigrations }) {
  return function (cb) {
    if (!appName) {
      inquirer.prompt([
        {
          type: 'input',
          name: 'appName',
          message: "What's the app's name?",
          validate: (answer) => answer.length >= 1
        },
        {
          type: 'confirm',
          name: 'doInstallPackages',
          message: "Install node modules of the new app when done?"
        }
      ])
      .then(function (answers) {
        appName = answers.appName
        doInstallPackages = answers.doInstallPackages
        if (!doInstallPackages) return { doRunMigrations: false } // can't run migrations without the database adapater installed
        return inquirer.prompt([{
          type: 'confirm',
          name: 'doRunMigrations',
          message: "Run migrations on the database of the new app when done? N.B. this will fail if you don't have Postgres installed"
        }])
      })
      .then(function (answers) {
        doRunMigrations = answers.doRunMigrations
        createApp({ appName, appDir, doInstallPackages, doRunMigrations })(cb)
      })
    } else {
      if (!appDir) appDir = path.relative(process.cwd(), appName)

      mkdirp(appDir, function (err) {
        if (err) {
          cb(err)
        } else {
          // create the core / top-level folders and files, then the app topic and a starter topic
          // then append to the app topic with extras it needs, and install packages / run migrations if user asked for them
          const starterTopicName = 'dogs'
          series([
            createCore({ appName, dir: appDir, templates: coreTemplates }),
            function (cb) {
              parallel([
                createTopic({ topicName: 'app', topicDir: path.join(appDir, 'app'), appDir }),
                createTopic({ topicName: starterTopicName, topicDir: path.join(appDir, starterTopicName), appDir })
              ], cb)
            },
            function (cb) {
              const extras = [ appendToAppTopic({ dir: path.join(appDir, 'app') }) ]
              if (doInstallPackages) extras.push(installPackages({ appDir }))
              if (doRunMigrations) extras.push(runMigrations({ appDir, appName }))
              series(extras, cb)
            }
          ], cb)
        }
      })
    }
  }
}
