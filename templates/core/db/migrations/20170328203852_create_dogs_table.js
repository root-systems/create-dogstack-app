const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    exports.up = function (knex, Promise) {
      return knex.schema.createTableIfNotExists('dogs', function (table) {
        table.increments('id')
        table.string('name')
      })
    }

    exports.down = function (knex, Promise) {
      return knex.schema.dropTableIfExists('dogs')
    }
  `
}
