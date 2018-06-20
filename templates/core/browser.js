const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import updater from './updater'
    import epic from './epic'
    import routes from './routes'
    import style from './style'
    import intl from './intl'
    import Layout from './app/containers/Layout'

    const createBrowserEntry = require('dogstack/browser')
    const authentication = require('dogstack-agents/client')
    const Config = require('dogstack/config')
    const config = Config()()
    window.config = config

    const store = {
      updater,
      epic
    }

    const client = {
      services: [
        authentication
      ],
      config
    }

    // root
    const appNode = document.createElement('div')
    appNode.id = 'app'
    document.body.appendChild(appNode)
    const root = {
      appNode: '#app',
      styleNode: '#app-styles',
    }

    createBrowserEntry({
      config,
      store,
      style,
      client,
      root,
      intl,
      routes,
      Layout
    })
  `
}
