const exec = require('child_process').exec

module.exports = function runMigrations ({ appDir, appName }) {
  return function (cb) {
    console.log('Running migrations...')
    const prevDir = process.cwd()
    process.chdir(appDir)
    exec(`psql -c "CREATE DATABASE ${appName}_development"`, function (err, stdout, stderr) {
      // TODO: IK: a better way of handling this
      const dbExistsError = `ERROR:  database "${appName}_development" already exists\n`
      if (err && stderr !== dbExistsError) {
        cb(err)
      } else {
        exec(`npm run db migrate:latest`, function (err) {
          if (err) {
            cb(err)
          } else {
            process.chdir(prevDir)
            cb(null, 'Migrations run successfully!')
          }
        })
      }
    })
  }
}
