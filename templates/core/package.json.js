const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    {
      "name": "${name}",
      "version": "0.0.0",
      "scripts": {
        "dev:asset": "node $(which dog) asset",
        "dev:api": "node-dev $(which dog) api",
        "dev": "npm-run-all --parallel dev:*",
        "start:asset": "dog asset",
        "start:api": "dog api",
        "start": "npm-run-all --parallel start:*",
        "build": "bankai build browser.js",
        "lint": "dog lint",
        "test": "dog test",
        "deps": "dependency-check . client.js epic.js layout.js root.js routes.js server.js store.js style.js updater.js  --detective precinct && dependency-check . client.js epic.js layout.js root.js routes.js server.js store.js style.js updater.js --extra --no-dev --detective precinct -i babelify -i babel-preset-es2015 -i babel-preset-react -i babel-plugin-ramda -i pg",
        "db": "dog db",
        "burnthemall": "rm -rf package-lock.json node_modules; npm i",
        "burnthedb": "rm db/dev.sqlite; dog db migrate:latest; dog db seed:run"
      },
      "browserify": {
        "transform": [
          "babelify",
          [
            "dogstack/transform",
            {
              "config": {
                "keys": [
                  "api",
                  "asset",
                  "authentication"
                ]
              }
            }
          ]
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
        "@material-ui/core": "^1.0.0",
        "@material-ui/icons": "^1.1.0",
        "babel-plugin-ramda": "^1.2.0",
        "babel-preset-es2015": "^6.9.0",
        "babel-preset-react": "^6.5.0",
        "babelify": "^7.3.0",
        "deep-extend": "^0.5.0",
        "dog-names": "^1.0.2",
        "dogstack": "root-systems/dogstack#restack",
        "dogstack-agents": "root-systems/dogstack-agents#restack",
        "feathers-action": "^2.4.0",
        "feathers-action-react": "^2.2.1",
        "feathers-errors": "^2.6.2",
        "feathers-hooks-common": "^3.0.0",
        "feathers-knex": "^2.6.3",
        "fela": "^6.1.7",
        "npm-run-all": "^4.1.2",
        "pg": "^6.1.5",
        "ramda": "^0.24.0",
        "react": "^16.4.0",
        "react-dom": "^16.4.0",
        "react-fela": "^7.2.0",
        "react-redux": "^4.4.5",
        "react-router-dom": "^4.1.1",
        "react-router-redux": "^5.0.0-alpha.6",
        "redux-form": "^7.0.0",
        "redux-form-material-ui": "^5.0.0-beta.3",
        "redux-fp": "^0.2.0",
        "redux-observable": "^0.14.1",
        "reselect": "^3.0.0"
      },
      "devDependencies": {
        "deep-freeze": "^0.0.1",
        "dependency-check": "^2.8.0",
        "node-dev": "^3.1.3",
        "precinct": "^3.6.0",
        "sqlite3": "^3.1.8"
      }
    }
  `
}
