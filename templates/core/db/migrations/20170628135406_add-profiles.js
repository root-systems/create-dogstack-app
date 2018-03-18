const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    exports.up = function (knex, Promise) {
      return knex.schema.createTableIfNotExists('profiles', function (table) {
        table.increments('id')
        table.integer('agentId').references('agents.id')
        table.text('name')
        table.text('description')
        table.text('avatar')
      })
    }

    exports.down = function (knex, Promise) {
      return knex.schema.dropTableIfExists('profiles')
    }
  `
}
