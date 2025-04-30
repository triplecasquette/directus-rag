import { MarkdownChunker } from '../../domain/chunking/MarkdownChunker.ts'

/**
 * 01 - Chunking Test
 * Simple test: chunk a small markdown file and print chunk info and token counts.
 */
const main = async () => {
  const chunker = new MarkdownChunker()
  const chunks = await chunker.chunk('./data/directus-docs/test.md')

  if (!chunks.length) {
    console.log('No chunks generated.')
    return
  }

  console.log(`Total chunks: ${chunks.length}\n`)
  chunks.forEach(chunk => {
    const tokenCount = chunk.content.split(/\s+/).length
    console.log(`→ Chunk #${chunk.metadata.index} (${chunk.metadata.heading})`)
    console.log(`Tokens: ${tokenCount}`)
    console.log('Preview:', chunk.content.slice(0, 80).replace(/\n/g, ' '), '\n')
  })
}

main()
