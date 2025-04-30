// scripts/test-search.ts

/**
 * 05 - Semantic Search Test
 * End-to-end test: embeds a sample question, queries the vector store (Qdrant), and prints detailed top results.
 * Shows preview of the query vector, input question, number of results, and details for each result (text, source, score).
 */
import { createVectorStore } from '../../domain/vector-store/VectorStoreFactory.ts'
import { GenericEmbedder } from '../../domain/embedding/GenericEmbedder.ts'
import { normalizeVector } from '../../utils/vector.ts'

const main = async () => {
  const store = createVectorStore(process.env.VECTOR_BACKEND || 'qdrant', {
    url: process.env.VECTORSTORE_URL || 'http://localhost:6333',
    collectionName: process.env.VECTOR_COLLECTION_NAME || 'docs_chunks',
  })
  const embedder = new GenericEmbedder()

  const input = 'How can I set up user authentication in Directus?'
  const raw = await embedder.embed(input)
  const embedding = normalizeVector(raw)

  console.log('--- Query vector (preview) ---')
  console.log(embedding.slice(0, 5).map(v => v.toFixed(4)).join(', '), '...')

  const results = await store.search(embedding, 20)

  console.log('\n--- Input question ---')
  console.log(input)
  console.log(`\n--- Top ${results.length} search results ---`)
  results.forEach((r, i) => {
    console.log(`\n#${i + 1}`)
    console.log('Text:', r.payload.text)
    console.log('Source:', r.payload.source)
    if (r.payload.section) console.log('Section:', r.payload.section)
    if (r.payload.lang) console.log('Lang:', r.payload.lang)
    if (r.payload.tokens) console.log('Tokens:', r.payload.tokens)
    console.log('Score:', r.score?.toFixed(4))
  })
}

main().catch(console.error)
