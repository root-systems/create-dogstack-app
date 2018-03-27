const dedent = require('dedent')

module.exports = function () {
  return dedent`
    import {
      green500,
      green600,
      green700,
      purple500,
      purple600,
      purple700,
      grey50,
      grey100,
      grey200,
      grey300,
      grey400,
      grey500,
      grey600,
      grey700,
      grey800,
      grey900,
      darkBlack,
      fullBlack,
      white
    } from 'material-ui/styles/colors'

    // GK: theme structure following https://github.com/jxnblk/styled-system/blob/master/README.md
    // and https://github.com/cloudflare/cf-ui/blob/master/packages/cf-style-const/src/variables.js

    export default {
      breakpoints: {
        mobile: '30em', // 480px,
        mobileWide: '37.5em', // 600px,
        tablet: '48em', // 768px,
        tabletWide: '56.25em', // 900px,
        desktop: '64em', // 1024px,
        desktopWide: '90em', // 1440px,
        desktopXL: '120em' // 1920px
      },
      space: [
        // exponential spacing because
        // http://tachyons.io/docs/layout/spacing/
        '0rem', // [0] SR: to override default allofthespace with noneofthespace
        '0.25rem', // [1]
        '0.5rem', // [2]
        '1rem', // [3]
        '2rem', // [4]
        '4rem', // [5]
        '8rem', // [6]
        '16rem', // [7]
        '32rem' // [8]
      ],
      fontSizes: [
        // typographic scale because
        // http://spencermortensen.com/articles/typographic-scale/
        // and
        // https://blog.madewithenvy.com/responsive-typographic-scales-in-css-b9f60431d1c4
        '0.8rem', // [0] 10pt
        '0.95rem', // [1] 11pt
        '1rem', // [2] 12pt
        '1.2rem', // [3] 14pt
        '1.4rem', // [4] 16pt
        '1.5rem', // [5] 18pt
        '1.7rem', // [6] 21pt
        '2rem', // [7] 24pt
        '3rem', // [8] 36pt
        '4rem', // [9] 48pt
        '5rem', // [10] 60pt
        '6rem', // [11] 72pt
        '8rem' // [12] 96pt
      ],
      fonts: {
        primary: 'Roboto, sans-serif',
        logo: '"Roboto", sans-serif'
      },
      colors: {
        primary1: green500,
        primary2: green600,
        primary3: green700,
        accent1: purple500,
        accent2: purple600,
        accent3: purple700,
        greys: [
          grey50, // [0]
          grey100, // [1]
          grey200, // [2]
          grey300, // [3]
          grey400, // [4]
          grey500, // [5]
          grey600, // [6]
          grey700, // [7]
          grey800, // [8]
          grey900 // [9]
        ],
        text: darkBlack,
        alternateText: white,
        canvas: white,
        border: grey300,
        shadow: fullBlack
      },
      fontWeights: {
        thin: 100,
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
        black: 900
      },
      em: '1em',
      rem: '1rem',
      borderRadius: '2px',
      zIndexMax: 1000
    }
  `
}
