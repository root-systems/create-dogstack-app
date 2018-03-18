const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    exports.up = function (knex, Promise) {
      return knex.schema.createTableIfNotExists('agents', function (table) {
        table.increments('id')
      })
      .then(() => {
        return knex.schema.table('credentials', function (table) {
          table.integer('agentId').references('agents.id')
        })
      })
    }

    exports.down = function (knex, Promise) {
      return knex.schema.table('credentials', function (table) {
        table.dropColumn('agentId')
      })
      .then(() => {
        return knex.schema.dropTableIfExists('agents')
      })
    }
  `
}
