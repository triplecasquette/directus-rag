// utils/parseMarkdown.ts
import MarkdownIt from 'markdown-it'
import prism from 'markdown-it-prism'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: (code, lang) => {
    try {
      const Prism = require('prismjs')
      const grammar = Prism.languages[lang] || Prism.languages.markup
      const highlighted = Prism.highlight(code, grammar, lang)
      return `<pre class="language-${lang} p-3 rounded bg-gray-900 overflow-auto mb-4"><code class="language-${lang}">${highlighted}</code></pre>`
    } catch {
      return `<pre><code>${code}</code></pre>`
    }
  },
}).use(prism)

export const parseMarkdown = (input: string): string => md.render(input)
