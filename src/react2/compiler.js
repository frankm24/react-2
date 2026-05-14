import React from 'react'

function getDepth(line) {
  const spaces = line.match(/^\s*/)?.[0].length ?? 0
  return Math.floor(spaces / 2)
}

function parseSelector(rawSelector) {
  const selector = rawSelector.trim()
  const tagMatch = selector.match(/^[a-zA-Z][a-zA-Z0-9-]*/)
  const tag = tagMatch ? tagMatch[0] : 'div'
  const classMatches = [...selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)]
  const idMatch = selector.match(/#([a-zA-Z0-9_-]+)/)

  return {
    tag,
    className: classMatches.map((m) => m[1]).join(' '),
    id: idMatch?.[1],
  }
}

function interpolate(text, context) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => String(context[key] ?? ''))
}

function parseMarkup(markup, context) {
  const lines = markup
    .split('\n')
    .map((line) => line.replace(/\t/g, '  '))
    .filter((line) => line.trim().length > 0)

  const root = { children: [] }
  const stack = [{ depth: -1, node: root }]

  for (const line of lines) {
    const depth = getDepth(line)
    const trimmed = line.trim()
    const [rawSelector, rawText = ''] = trimmed.split('::')
    const { tag, className, id } = parseSelector(rawSelector)

    const node = {
      tag,
      className,
      id,
      text: interpolate(rawText.trim(), context),
      children: [],
    }

    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop()
    }

    stack[stack.length - 1].node.children.push(node)
    stack.push({ depth, node })
  }

  return root.children
}

function toReactNodes(nodes, keyPrefix = 'r2') {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    const props = {
      key,
      ...(node.className ? { className: node.className } : {}),
      ...(node.id ? { id: node.id } : {}),
    }

    const children = [
      ...(node.text ? [node.text] : []),
      ...toReactNodes(node.children, key),
    ]

    return React.createElement(node.tag, props, ...children)
  })
}

export function compileReact2(markup, context = {}) {
  const ast = parseMarkup(markup, context)
  return toReactNodes(ast)
}
