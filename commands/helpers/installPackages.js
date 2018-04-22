const exec = require('child_process').exec

module.exports = function installPackages ({ appDir }) {
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
