const dedent = require('dedent')

module.exports = function (name) {
  return dedent`
    <html>
      <head>
        <title>${name}</title>
        <style id="app-styles"></style>
        <style id="app-fonts"></style>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="https://afeld.github.io/emoji-css/emoji.css" rel="stylesheet" />
      </head>
      <body>
      </body>
    </html>
  `
}
