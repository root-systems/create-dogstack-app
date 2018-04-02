const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { connect } from 'react-redux'

    import Layout from '../components/Layout'

    import getLayoutProps from '../getters/getLayoutProps'

    export default connect(
      getLayoutProps
    )(Layout)
  `
}
