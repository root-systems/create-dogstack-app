const dedent = require('dedent')

module.exports = function (topic) {
  return dedent`
    import h from 'react-hyperscript'
    import { compose } from 'recompose'
    import { connect as connectFela } from 'react-fela'
    import { Route, Switch } from 'react-router-dom'
    import { pipe, map, values, isNil } from 'ramda'
    import { FormattedMessage } from 'dogstack/intl'
    import { Link } from 'react-router-dom'
    import Button from '@material-ui/core/Button'

    import styles from '../styles/Home'

    export default compose(
      connectFela(styles)
    )(Home)

    function Home (props) {
      const { styles, routes } = props

      return (
        h('div', {
          className: styles.container
        }, [
          h('header', {
            className: styles.header
          }, [
            h('h1', {
              className: styles.title
            }, [
              h(FormattedMessage, {
                id: 'app.name',
                className: styles.titleText
              })
            ]),
            h('p', {
              className: styles.tagline
            }, [
              h(FormattedMessage, {
                id: 'app.tagline',
                className: styles.taglineText
              })
            ]),
            h('div', {
              className: styles.buttonsContainer
            }, [
              h(Link, {
                to: '/sign-in'
              }, [
                h(Button, {
                  variant: 'raised',
                  color: 'primary'
                }, [
                  h(FormattedMessage, {
                    id: 'agents.signIn',
                    className: styles.buttonText
                  })
                ])
              ]),
              h(Link, {
                to: '/register'
              }, [
                h(Button, {
                  variant: 'raised',
                  color: 'primary'
                }, [
                  h(FormattedMessage, {
                    id: 'agents.register',
                    className: styles.buttonText
                  })
                ])
              ])
            ])
          ])
        ])
      )
    }
  `
}
