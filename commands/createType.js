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

module.exports = function createType ({ typeName, folderName, folderPath, topicName, template }) {

  return function (cb) {
    if (typeName && !includes(templateOptions, typeName)) {
      cb(new Error(`${typeName} is an unsupported type: please pick one of ${templateOptions.join(', ')}`))
    } else if (!typeName) {
      inquirer.prompt([{
        type: 'list',
        name: 'input',
        message: "Which type?",
        choices: templateOptions
      }])
      .then(function (answers) {
        typeName = answers.input
        templateFn = typesTemplates[answers.input]
        // TODO: IK: ideally ask the user if this type is for an existing topic, which would let us figure out the name and the dir, maybe scan some levels of lower folders for matching names or something
        return inquirer.prompt([{
          type: 'input',
          name: 'input',
          message: `What's the name of the ${answers.input}?`,
          validate: (answer) => answer.length >= 1
        }])
      })
      .then(function (answers) {
        topicName = answers.input
        folderPath = process.cwd() // TODO: IK: think about nice ways to prompt the user to pick a dir,
        createType({
          typeName,
          folderName: topicName,
          folderPath,
          topicName,
          template: templateFn(topicName)
        })(cb)
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
