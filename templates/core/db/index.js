const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    var { join } = require('path')
    // Update with your config settings.

    module.exports = {
      migrations: {
        directory: join(__dirname, 'migrations')
      },
      seeds: {
        directory: join(__dirname, 'seeds')
      },

      development: {
        client: 'postgresql',
        connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'password',
          database: '${name}_development'
        }
      },

      test: {
        client: 'sqlite3',
        connection: {
          filename: ':memory:'
        },
        useNullAsDefault: true
      },

      staging: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
      },

      production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
      }
    }
  `
}
