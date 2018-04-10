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

module.exports = function wireUpdater ({ appDir, topicName, typeName }) {
  return function (cb) {
    const filePath = path.join(appDir, 'updater.js')
    fs.readFile(filePath, 'utf8', function (err, file) {
      if (err) cb(err)
      const ast = recast.parse(file)

      const transformCode = flow(addImport, addExport, property('ast'))
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
    [build.importSpecifier(
      build.identifier('updater'),
      build.identifier(typeName)
    )],
    build.literal(`./${topicName}/dux/${typeName}`)
  )
  ast.program.body.splice(lastImportIndex + 1, 0, newImport)
  return { ast, topicName, typeName }
}

function addExport ({ ast, topicName, typeName }) {
  const nodeExport = ast.program.body.find((node) => node.type === 'ExportDefaultDeclaration')
  const newExport = build.identifier(typeName)
  nodeExport.declaration.arguments.push(newExport)
  return { ast, topicName, typeName }
}
