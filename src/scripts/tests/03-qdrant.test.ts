/**
 * 03 - Qdrant Insertion Test
 * Minimal test: inserts a point into the vector store (Qdrant) and displays the result.
 * Checks that the insertion does not throw and shows a preview of the vector and payload.
 */
import { createVectorStore } from '../../domain/vector-store/VectorStoreFactory.ts'
import { GenericEmbedder } from '../../domain/embedding/GenericEmbedder.ts'
import { normalizeVector } from '../../utils/vector.ts'
import { randomUUID } from 'crypto'

const main = async () => {
  const store = createVectorStore(process.env.VECTOR_BACKEND || 'qdrant', {
    url: process.env.VECTORSTORE_URL || 'http://localhost:6333',
    collectionName: process.env.VECTOR_COLLECTION_NAME || 'docs_chunks',
  })
  const embedder = new GenericEmbedder()

  const text = 'Trying to debug is not so easy.'
  const rawVector = await embedder.embed(text)
  const vector = normalizeVector(rawVector)

  const testPoint = {
    id: randomUUID(),
    vector,
    payload: {
      text,
      source: 'test.md',
      section: 'Introduction',
      lang: 'en',
      tokens: text.split(' ').length,
    },
  }

  console.log('--- Point to insert ---')
  console.log('Vector (preview):', vector.slice(0, 5).map(v => v.toFixed(4)).join(', '), '...')
  console.log('Payload:', testPoint.payload)

  try {
    await store.addDocuments([testPoint])
    console.log('✅ Point successfully added to Qdrant.')
  } catch (err) {
    console.error('❌ Error while inserting the point:', err)
  }
}

main()
