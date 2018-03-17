#!/usr/bin/env node

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const dedent = require('dedent')
const inquirer = require('inquirer')

const createTopic = require('./createTopic')

const promptText = `
  Please provide a valid command:
  - app
  - topic

  e.g. $ npx create-dogstack-app topic

  or $ npx create-dogstack-app --help to see all options in full.
`

;(function main (argv) {
  const cmd = argv._[0]
  const arg = argv._[1]

  switch (cmd) {
    case 'app':
      console.log('not yet implemented')
      // createApp(arg)
      break
    case 'topic':
      createTopic(arg)
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
        'topic'
      ]
    }])
    .then(function (answers) {
      const command = answers.command
      main({ _: [command] })
    })
  }
})(argv)
