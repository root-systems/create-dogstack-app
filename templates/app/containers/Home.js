const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import { connect } from 'react-redux'

    import Home from '../components/Home'

    import { getHomeProps } from '../getters/getHomeProps'

    export default connect(
      getHomeProps
    )(Home)
  `
}
