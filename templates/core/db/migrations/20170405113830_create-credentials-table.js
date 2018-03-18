const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    exports.up = function (knex, Promise) {
      return knex.schema.createTableIfNotExists('credentials', function (table) {
        table.increments('id')
        table.string('password')
        table.string('email').unique()
      })
    }

    exports.down = function (knex, Promise) {
      return knex.schema.dropTableIfExists('credentials')
    }
  `
}
