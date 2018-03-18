const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    {
      "name": "${name}",
      "version": "0.0.0",
      "scripts": {
        "start": "dog server",
        "dev": "dog dev server",
        "lint": "dog lint",
        "test": "dog test",
        "deps": "dependency-check . client.js epic.js layout.js root.js routes.js server.js store.js style.js updater.js  --detective precinct && dependency-check . client.js epic.js layout.js root.js routes.js server.js store.js style.js updater.js --extra --no-dev --detective precinct -i babelify -i babel-preset-es2015 -i babel-preset-react -i babel-plugin-ramda -i pg",
        "db": "dog db",
        "burnthemall": "rm -rf package-lock.json node_modules; npm i",
        "burnthedb": "rm db/dev.sqlite; dog db migrate:latest; dog db seed:run"
      },
      "browserify": {
        "transform": [
          "babelify"
        ]
      },
      "babel": {
        "presets": [
          "es2015",
          "react"
        ],
        "plugins": [
          "ramda"
        ]
      },
      "dependencies": {
        "babel-plugin-ramda": "^1.2.0",
        "babel-preset-es2015": "^6.9.0",
        "babel-preset-react": "^6.5.0",
        "babelify": "^7.3.0",
        "deep-extend": "^0.5.0",
        "dog-names": "^1.0.2",
        "dogstack": "^0.7.0",
        "dogstack-agents": "^0.8.2",
        "feathers-action": "^2.4.0",
        "feathers-action-react": "^2.2.1",
        "feathers-errors": "^2.6.2",
        "feathers-hooks-common": "^3.0.0",
        "feathers-knex": "^2.6.3",
        "fela": "^5.0.1",
        "material-ui": "^0.19.1",
        "pg": "^6.1.5",
        "ramda": "^0.23.0",
        "react": "^15.5.4",
        "react-fela": "^6.0.3",
        "react-redux": "^4.4.5",
        "react-router-dom": "^4.1.1",
        "react-router-redux": "^5.0.0-alpha.6",
        "react-tap-event-plugin": "^2.0.1",
        "redux-form": "^7.0.0",
        "redux-form-material-ui": "^4.2.0",
        "redux-fp": "^0.2.0",
        "redux-observable": "^0.14.1",
        "reselect": "^3.0.0"
      },
      "devDependencies": {
        "deep-freeze": "^0.0.1",
        "dependency-check": "^2.8.0",
        "precinct": "^3.6.0",
        "sqlite3": "^3.1.8"
      }
    }
  `
}
