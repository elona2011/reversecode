const fs = require('fs')
const babelParser = require("@babel/parser")
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generate = require('@babel/generator').default

let s = fs.readFileSync('./source.js', 'utf8')
// s = `U = (n = R(q),R(q))`
// s = `(0, k[(x.P = [], 1)])()`
s = `k[(x.P = [], 1)]`
let tree = babelParser.parse(s)
let newCode = generate(tree)
fs.writeFileSync('./out0.js', newCode.code)

traverse(tree, {
  // AssignmentExpression(path) {
  //   if (path.node.right.type === 'SequenceExpression') {
  //     let exps = path.node.right.expressions
  //     exps[exps.length - 1] = t.assignmentExpression('=', path.node.left, exps[exps.length - 1])
  //     path.replaceWith(t.sequenceExpression(path.node.right.expressions))
  //   }
  // },
  CallExpression(path) {
    if (path.node.callee.type === 'SequenceExpression') {
      let exps = path.node.callee.expressions
      exps[exps.length - 1] = t.callExpression(exps[exps.length - 1], path.node.arguments)
      path.replaceWith(t.sequenceExpression(path.node.callee.expressions))
    }
  }
})

newCode = generate(tree)
fs.writeFileSync('./out.js', newCode.code)
// console.log(newCode.code)
debugger