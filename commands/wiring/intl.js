const path = require('path')
const fs = require('fs')
const flow = require('lodash/flow')
const property = require('lodash/property')
const recast = require('recast')
const build = recast.types.builders
const nodeTypes = recast.types.namedTypes

// TODO: IK: we lose code formatting by doing this, like semicolon insertion, whitespace etc
// could use something like https://github.com/yyx990803/semi for semicolon removal
// but probably better to run prettier or something similar after create-dogstack-app commands

module.exports = function wireIntl ({ appDir, topicName, typeName }) {
  return function (cb) {
    const filePath = path.join(appDir, 'intl.js')
    fs.readFile(filePath, 'utf8', function (err, file) {
      if (err) cb(err)
      const ast = recast.parse(file)

      const transformCode = flow(addImport, addLocaleToArray, property('ast'))
      const newFile = recast.print(
        transformCode({ ast, topicName, typeName }),
        { quote: 'single' }
      ).code

      fs.writeFile(filePath, newFile, function (err) {
        if (err) cb(err)
        cb(null)
      })
    })
  }
}

function addImport ({ ast, topicName, typeName }) {
  const lastImportIndex = ast.program.body.map((node) => node.type).lastIndexOf('ImportDeclaration')
  const newImport = build.importDeclaration(
    [build.importDefaultSpecifier(
      build.identifier(`${typeName}Locale`)
    )],
    build.literal(`./${topicName}/locales/${typeName}`)
  )
  ast.program.body.splice(lastImportIndex + 1, 0, newImport)
  return { ast, topicName, typeName }
}

function addLocaleToArray ({ ast, topicName, typeName }) {
  // TODO: IK: i wrote these names late at night, refactor to something easier to understand
  const nodeLocalesDeclaration = ast.program.body.find((node) => {
    return node.declarations && findLocalesDeclaration(node.declarations)
  })
  const nodeLocalesDeclarationArrayExpression = findLocalesDeclaration(nodeLocalesDeclaration.declarations).init
  const newLocale = build.identifier(`${typeName}Locale`)
  nodeLocalesDeclarationArrayExpression.elements.push(newLocale)
  return { ast, topicName, typeName }
}

function findLocalesDeclaration (declarations) {
  return declarations.find(dec => dec.id.name === 'locales')
}
