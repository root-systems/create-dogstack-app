const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    exports.up = function (knex, Promise) {
      return knex.schema.table('credentials', function (table) {
        table.string('googleId').unique()
        table.string('facebookId').unique()
        table.string('githubId').unique()
        table.string('twitterId').unique()
      })
    }

    exports.down = function (knex, Promise) {
      return knex.schema.table('credentials', function (table) {
        table.dropColumn('googleId')
        table.dropColumn('facebookId')
        table.dropColumn('githubId')
        table.dropColumn('twitterId')
      })
    }
  `
}
