const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { reduce, mergeDeepRight } from 'ramda'
    import { addLocaleData } from 'react-intl'
    import en from 'react-intl/locale-data/en'

    addLocaleData([...en])

    import appLocale from './app/locales/app'
    import dogsLocale from './dogs/locales/dogs'

    const locales = [
      appLocale,
      dogsLocale
    ]

    const messagesByLocale = reduce(mergeDeepRight, {}, locales)

    export default {
      messagesByLocale
    }
  `
}
