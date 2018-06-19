const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    {
      "name": "${name}",
      "addons": [
        "heroku-postgresql:hobby-dev",
        "papertrail"
      ],
      "env": {
        "API_URL": {
          "description": "the url that the app is running at (if you are deploying from the README, replace [app name] below with the app name you chose above)",
          "value": "https://[app name].herokuapp.com/"
        },
        "ASSET_URL": {
          "description": "the url of the asset server (if you are deploying from the README, replace [app name] below with the app name you chose for the Netlify deployment)",
          "value": "https://[app name].netlify.com/"
        },
        "AUTHENTICATION_SECRET": {
          "description": "secret for auth",
          "generator": "secret"
        },
        "PGSSLMODE": {
          "description": "sets postgres ssl mode to true",
          "value": "require"
        }
      },
      "scripts": {
        "postdeploy": "npm run db migrate:latest && npm run db seed:run"
      }
    }
  `
}
