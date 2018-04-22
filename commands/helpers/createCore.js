const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const parallel = require('run-parallel')
const map = require('lodash/map')

module.exports = function createCore ({ appName, dir, templates }) {
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
