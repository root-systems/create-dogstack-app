const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const capitalize = require('lodash/capitalize')

/*
- Creates a type file
*/

module.exports = function createType ({ typeName, folderName, folderPath, topicName, template }, cb) {
  const fileName = typeName === 'getter' ? `get${capitalize(topicName)}Props.js` : `${topicName}.js`
  const filePath = path.join(folderPath, fileName)
  fs.writeFile(filePath, template, function (err) {
    if (err) return cb(err)
    cb(null, folderName)
  })
}
