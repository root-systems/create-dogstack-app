const path = require('path')
const fs = require('fs')
const parallel = require('run-parallel')
const bulk = require('bulk-require')

const createCore = require('./createCore')
const appTemplatesDir = path.resolve(__dirname, '../../templates/app')
const appTemplates = bulk(appTemplatesDir, '**/*.js')

// this is broken out to allow creating the 'app' topic to use createTopic
// i.e. there are extra files / folders in the app topic atm that dogstack expects compared to a 'normal' topic
// consider whether these folders / files might be better somewhere else in future from a dogstack perspective
module.exports = function appendToAppTopic ({ dir }) {
  return function (cb) {
    parallel([
      createCore({ appName: null, dir, templates: appTemplates }),
      copyNonJS({ dir })
    ], cb)
  }
}

function copyNonJS ({ dir }) {
  return function (cb) {
    // TODO: IK: only handling the favicon hardcoded atm, maybe theres also a better way to do this
    // like read all non-js from the appTemplatesDir, just copy it over at the same place relative to dir structure?
    const file = 'favicon.ico'
    const reader = fs.createReadStream(path.join(appTemplatesDir, file))
    const writer = fs.createWriteStream(path.join(dir, file))

    reader.on('error', function (err) { cb(err) })
    writer.on('error', function (err) { cb(err) })
    writer.on('finish', function () { cb(null) })

    reader.pipe(writer)
  }
}
