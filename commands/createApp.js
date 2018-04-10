const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const bulk = require('bulk-require')
const map = require('lodash/map')
const series = require('run-series')
const exec = require('child_process').exec

const createTopic = require('./createTopic')
const coreTemplatesDir = path.resolve(__dirname, '../templates/core')
const coreTemplates = bulk(coreTemplatesDir, '**/*.js')

/*
- Creates a folder for a dogstack app
- Creates the basic sub-folders and files (including top-level files and 'app' folder + files)
- Installs the modules specified in the basic package.json
- App should be ready to run
*/

module.exports = function createApp ({ appName, appDir }) {
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
        createApp({ appName, appDir })(cb)
      })
    } else {
      if (!appDir) appDir = path.relative(process.cwd(), appName)

      mkdirp(appDir, function (err) {
        if (err) {
          cb(err)
        } else {
          const topicName = 'dogs'
          series([
            function (cb) {
              parallel([
                createTopic({ topicName: 'app', appDir, dir: path.join(appDir, 'app') }),
                createTopic({ topicName, appDir, dir: path.join(appDir, topicName) }),
                createCore({ appName, dir: appDir, templates: coreTemplates })
              ], cb)
            },
            function (cb) {
              series([
                appendToAppTopic({ dir: path.join(appDir, 'app') }),
                installPackages({ appDir })
              ], cb)
            }
          ], cb)
        }
      })
    }
  }
}

function createCore ({ appName, dir, templates }) {
  return function (cb) {
    parallel(
      map(templates, (templateFn, name) => {
        return function (cb) {
          // TODO: IK: a more elegant way of guarding this
          if (Object.keys(templateFn).length > 0 && name !== 'index') {
            // a folder with core files at some sub-level
            const subDir = path.join(dir, name)
            mkdirp(subDir, function (err) {
              if (err) {
                cb(err)
              } else {
                createCore({ appName, dir: subDir, templates: templateFn })(cb)
              }
            })
          } else {
            // TODO: IK: a more robust way of identifying files that aren't .js, some regex or something
            // cause what about .test.js files in the future?
            const filename = name.includes('.') ? name : `${name}.js`
            const filePath = path.join(dir, filename)
            const template = templateFn(appName)
            fs.writeFile(filePath, template, function (err) {
              if (err) return cb(err)
              cb(null, name)
            })
          }
        }
      }),
      cb
    )
  }
}

function installPackages ({ appDir }) {
  return function (cb) {
    console.log('Installing packages...')
    try {
      const prevDir = process.cwd()
      process.chdir(appDir)
      exec('npm install', function (err) {
        if (err) {
          cb(err)
        } else {
          process.chdir(prevDir)
          cb(null, 'Packages installed successfully!')
        }
      })
    } catch (err) {
      cb(err)
    }
  }
}

// TODO: IK: this is broken out to allow creating the 'app' topic to use createTopic
// consider whether these folders / files might be better somewhere else in future
function appendToAppTopic ({ dir }) {
  const appTemplatesDir = path.resolve(__dirname, '../templates/app')
  const appTemplates = bulk(appTemplatesDir, '**/*.js')

  return function (cb) {
    parallel([
      createCore({ appName: null, dir, templates: appTemplates }),
      copyNonJS({ dir })
    ], cb)
  }

  function copyNonJS ({ dir }) {
    return function (cb) {
      // TODO: IK: only handling the favicon hardcoded atm, maybe theres also a better way to do this
      const file = 'favicon.ico'
      const reader = fs.createReadStream(path.join(appTemplatesDir, file))
      const writer = fs.createWriteStream(path.join(dir, file))
      writer.on('finish', function () {
        cb(null)
      })

      reader.on('error', function (err) {
        cb(err)
      })
      writer.on('error', function (err) {
        cb(err)
      })

      reader.pipe(writer)
    }
  }
}
