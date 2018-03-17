const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')

const container = require('./templates/container')
const component = require('./templates/component')
const service = require('./templates/service')
const dux = require('./templates/dux')
const getter = require('./templates/getter')
const style = require('./templates/style')

module.exports = function (dirname) {
  if (dirname) {
    createTopic(dirname)
  } else {
    inquirer.prompt([{
      type: 'input',
      name: 'input',
      message: "What's the topic's name?",
      validate: (answer) => answer.length >= 1
    }]).then(function (answers) {
      var answer = answers.input
      createTopic(answer)
    })
  }
}

function createTopic (topicName) {
  const relative = path.relative(process.cwd(), topicName)
  mkdirp(relative, function (err) {
    if (err) {
      console.log('Aborting. The following error occured:')
      console.log('  ' + err.message + '\n')
      process.exitcode = 1
    } else {
      parallel([
        createTopicFolder('containers', topicName),
        createTopicFolder('components', topicName),
        createTopicFolder('services', topicName),
        createTopicFolder('dux', topicName),
        createTopicFolder('getters', topicName),
        createTopicFolder('styles', topicName)
      ], function (err, res) {
        if (err) {
          console.log('Aborting. The following error occured:')
          console.log('  ' + err.message + '\n')
          process.exitcode = 1
        } else {
          console.log(`Created ${relative}, and ${res} folders`)
        }
      })
    }
  })

  function createTopicFolder (folderName, topicName) {
    return function (cb) {
      const folderPath = path.join(relative, folderName)
      mkdirp(folderPath, function (err) {
        if (err) cb(err)

        switch (folderName) {
          case 'containers':
            createTopicFile({ folderName, folderPath, topicName, template: container(topicName) }, cb)
            break;
          case 'components':
            createTopicFile({ folderName, folderPath, topicName, template: component(topicName) }, cb)
            break;
          case 'services':
            createTopicFile({ folderName, folderPath, topicName, template: service(topicName) }, cb)
            break;
          case 'dux':
            createTopicFile({ folderName, folderPath, topicName, template: dux(topicName) }, cb)
            break;
          case 'getters':
            createTopicFile({ folderName, folderPath, topicName, template: getter(topicName) }, cb)
            break;
          case 'styles':
            createTopicFile({ folderName, folderPath, topicName, template: style(topicName) }, cb)
            break;
        }
      })
    }
  }
}

function createTopicFile ({ folderName, folderPath, topicName, template }, cb) {
  const filePath = path.join(folderPath, `${topicName}.js`)
  fs.writeFile(filePath, template, function (err) {
    if (err) return cb(err)
    cb(null, folderName)
  })
}
