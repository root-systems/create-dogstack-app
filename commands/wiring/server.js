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

module.exports = function wireServer ({ appDir, topicName, typeName }) {
  return function (cb) {
    const filePath = path.join(appDir, 'server.js')
    fs.readFile(filePath, 'utf8', function (err, file) {
      if (err) cb(err)
      const ast = recast.parse(file)

      const transformCode = flow(addRequireToArray, property('ast'))
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

function addRequireToArray ({ ast, topicName, typeName }) {
  // TODO: IK: i wrote these names late at night, refactor to something easier to understand
  const nodeServicesDeclaration = ast.program.body.find((node) => {
    return node.declarations && findServicesDeclaration(node.declarations)
  })
  const nodeServicesDeclarationArrayExpression = findServicesDeclaration(nodeServicesDeclaration.declarations).init
  const newServiceRequire = build.callExpression(
    build.identifier('require'),
    [build.literal(`./${topicName}/services/${typeName}`)]
  )
  nodeServicesDeclarationArrayExpression.elements.push(newServiceRequire)
  return { ast, topicName, typeName }
}

function findServicesDeclaration (declarations) {
  return declarations.find(dec => dec.id.name === 'services')
}
