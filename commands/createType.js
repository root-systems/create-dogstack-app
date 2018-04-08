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

/*
- Creates a type file
*/

// TODO: IK: change topicName here to fileName or something similar, think it makes more sense
module.exports = function createType ({ typeName, folderName, folderPath, topicName, template }) {
  return function (cb) {
    if (typeName && !includes(templateOptions, typeName)) {
      cb(new Error(`${typeName} is an unsupported type: please pick one of ${templateOptions.join(', ')}`))
    } else if (!typeName) {
      const startDir = process.cwd()

      fs.readdir(startDir, function (err, files) {
        if (err) cb(err)

        const topicPaths = files
        .map((name) => path.join(startDir, name))
        .filter((file) => fs.lstatSync(file).isDirectory()) // TODO: IK: use async lstat?
        .filter((dir) => {
          const base = path.basename(dir)
          return base !== 'config' && base !== 'db' && base !== 'node_modules'
        })
        const topics = topicPaths.map((topicPath) => path.basename(topicPath))

        inquirer.prompt([
          {
            type: 'list',
            name: 'whichType',
            message: "Which type?",
            choices: templateOptions
          },
          {
            type: 'list',
            name: 'whichTopic',
            message: "Which topic? (if the choices don't make sense, make sure you are running create-dogstack-app from your app's root directory)",
            choices: topics
          }
        ])
        .then(function (answers) {
          typeName = answers.whichType
          templateFn = typesTemplates[answers.whichType]
          folderName = typeName === 'dux' ? typeName : typeName + 's' // pluralize folder names
          folderPath = path.join(startDir, answers.whichTopic, folderName)
          return inquirer.prompt([{
            type: 'input',
            name: 'fileName',
            message: `What's the name of the ${answers.whichType}?`,
            validate: (answer) => answer.length >= 1
          }])
        })
        .then(function (answers) {
          topicName = answers.fileName
          createType({
            typeName,
            folderName,
            folderPath,
            topicName,
            template: templateFn(topicName)
          })(cb)
        })
      })
    } else {
      const fileName = typeName === 'getter' ? `get${capitalize(topicName)}Props.js` : `${topicName}.js`
      const filePath = path.join(folderPath, fileName)
      fs.writeFile(filePath, template, function (err) {
        if (err) return cb(err)
        cb(null, folderName)
      })
    }
  }
}
