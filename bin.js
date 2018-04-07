#!/usr/bin/env node

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const dedent = require('dedent')
const inquirer = require('inquirer')

const createApp = require('./commands/createApp')
const createTopic = require('./commands/createTopic')
const createType = require('./commands/createType')

const promptText = `
  Please provide a valid command:
  - app
  - topic
  - type

  e.g. $ npx create-dogstack-app topic

  or $ npx create-dogstack-app --help to see all options in full.
`

;(function main (argv) {
  const cmd = argv._[0]
  const arg = argv._[1]

  switch (cmd) {
    case 'app':
      createApp({ appName: arg })(done)
      break
    case 'topic':
      createTopic({ topicName: arg })(done)
      break
    case 'type':
      createType({ typeName: arg })(done)
      break
    default:
      prompt()
  }

  function prompt () {
    console.log(promptText)
    inquirer.prompt([{
      type: 'list',
      name: 'command',
      message: 'Choose a valid command:',
      choices: [
        'app',
        'topic',
        'type'
      ]
    }])
    .then(function (answers) {
      const command = answers.command
      main({ _: [command] })
    })
  }

  function done (err, res) {
    if (err) {
      console.log('Aborting. The following error occured:')
      console.log('  ' + err.message + '\n')
      process.exitcode = 1
    } else {
      console.log(res)
    }
  }
})(argv)
