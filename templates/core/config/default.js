const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    const deepExtend = require('deep-extend')

    var config = {
      favicon: 'app/favicon.ico',
      app: {
        name: '${name}',
      },
      api: {
        port: 3001,
        url: 'http://localhost:3001',
      },
      asset: {
        port: 3000,
        entry: 'browser.js',
        root: 'app/assets',
        url: 'http://localhost:3000/'
      },
      log: {
        level: 'info'
      }
    }

    config.browser = {
      app: config.app,
      assets: config.assets
    }

    module.exports = deepExtend(
      require('dogstack-agents/config'),
      config
    )
  `
}
