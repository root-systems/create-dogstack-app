const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { reduce, mergeDeepRight } from 'ramda'
    import { addLocaleData } from 'react-intl'
    import en from 'react-intl/locale-data/en'

    addLocaleData([...en])

    import appLocale from './app/locales/app'

    const locales = [
      appLocale
    ]

    const messagesByLocale = reduce(mergeDeepRight, {}, locales)

    export default {
      messagesByLocale
    }
  `
}
