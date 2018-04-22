// borrowed from https://github.com/tgriesser/knex/blob/843a16799d465c3e65a58b1faab5e906f46c675b/src/migrate/index.js#L428
// TODO: IK: replace this with something from date-fns
module.exports = function knexMigrationDate() {
  const d = new Date()
  return d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())

  function padDate(segment) {
    segment = segment.toString();
    return segment[1] ? segment : `0${segment}`;
  }
}
