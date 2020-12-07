const Config = require('markdown-it-chain')
// const anchorPlugin = require('markdown-it-anchor')
// const slugify = require('transliteration').slugify
const hljs = require('highlight.js')

const containers = require('./containers')
const overWriteFenceRule = require('./fence')

const config = new Config()

// 配置markdown-it常规代码高亮，相关文档：https://markdown-it.github.io/markdown-it/#MarkdownIt.new
const highlight = (str, lang) => {
  if (!lang || !hljs.getLanguage(lang)) {
    return '<pre><code class="hljs">' + str + '</code></pre>'
  }
  const html = hljs.highlight(lang, str, true, undefined).value
  return `<pre><code class="hljs language-${lang}">${html}</code></pre>`
}

config.options
  .html(true)
  .highlight(highlight)
  .end()

  .plugin('containers')
  .use(containers)
  .end()

// 这个插件生成的 href 没有带前缀，导致报错，
// 例如：http://0.0.0.0:8086/#/npm-an-zhuang
// http://0.0.0.0:8086/#/zh-CN/component/installation#npm-an-zhuang
// .plugin('anchor')
// .use(anchorPlugin, [
//   {
//     level: 2,
//     slugify: slugify,
//     permalink: true,
//     permalinkBefore: true
//   }
// ])
// .end()

const md = config.toMd()
overWriteFenceRule(md)

module.exports = md
