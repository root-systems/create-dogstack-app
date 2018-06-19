const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import updater from './updater'
    import epic from './epic'
    import routes from './routes'
    import style from './style'
    import Layout from './app/containers/Layout'

    import appLocale from './app/locales/app'
    import { reduce, mergeDeepRight } from 'ramda'
    import { addLocaleData } from 'react-intl'
    import en from 'react-intl/locale-data/en'

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
      apiUrl: config.api.url
    }

    // root
    const appNode = document.createElement('div')
    appNode.id = 'app'
    document.body.appendChild(appNode)
    const root = {
      appNode: '#app',
      styleNode: '#app-styles',
    }

    // intl
    addLocaleData([...en])
    const locales = [
      appLocale
    ]
    const messagesByLocale = reduce(mergeDeepRight, {}, locales)
    const intl = {
      messagesByLocale
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
