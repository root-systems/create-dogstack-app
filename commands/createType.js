const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')

/*
- Creates a type file
*/

module.exports = function createType ({ folderName, folderPath, topicName, template }, cb) {
  const filePath = path.join(folderPath, `${topicName}.js`)
  fs.writeFile(filePath, template, function (err) {
    if (err) return cb(err)
    cb(null, folderName)
  })
}
