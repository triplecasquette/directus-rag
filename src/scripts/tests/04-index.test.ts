// scripts/test-full-index.ts
import { documentChunksToQdrantPoints } from '../../domain/vector-store/mappers/documentChunksToQdrantPoints.ts'
import { MarkdownChunker } from '../../domain/chunking/MarkdownChunker.ts'
import { createVectorStore } from '../../domain/vector-store/VectorStoreFactory.ts'
import { BgeM3Embedder } from '~/src/domain/embedding/BgeM3Embedder.ts'

/**
 * 04 - Full Indexing Pipeline Test
 * End-to-end test: chunks a markdown file, embeds the chunks, and indexes them in the vector store (Qdrant).
 * Shows detailed logs: number of chunks, preview of first chunk, number of vectors, preview of first vector, number of points, preview of first point, and success/error.
 */
const run = async () => {
  const filePath = './data/directus-docs/test.md' // simple test file
  const embedder = new BgeM3Embedder()
  const vectorStore = createVectorStore(process.env.VECTOR_BACKEND || 'qdrant', {
    url: process.env.VECTORSTORE_URL || 'http://localhost:6333',
    collectionName: process.env.VECTOR_COLLECTION_NAME || 'docs_chunks',
  })

  try {
    const chunker = new MarkdownChunker()
    const chunks = await chunker.chunk(filePath)
    console.log(`🧩 ${chunks.length} chunks extracted`)
    if (chunks.length > 0) {
      console.log('First chunk preview:', JSON.stringify(chunks[0], null, 2))
    }

    const texts = chunks.map(c => c.content)
    const vectors = await Promise.all(texts.map(text => embedder.embed(text)))
    console.log(`📐 ${vectors.length} vectors generated`)
    if (vectors.length > 0) {
      console.log('First vector preview:', vectors[0].slice(0, 5).map(v => v.toFixed(4)).join(', '), '...')
    }

    const points = documentChunksToQdrantPoints(chunks, vectors)
    console.log(`📦 ${points.length} points ready to be sent`)
    if (points.length > 0) {
      console.log('First point preview:', JSON.stringify({
        id: points[0].id,
        vector: points[0].vector.slice(0, 5).map(v => v.toFixed(4)),
        payload: points[0].payload,
      }, null, 2))
    }

    await vectorStore.addDocuments(points)
    console.log('✅ All points successfully sent to Qdrant.')
  } catch (err) {
    console.error('❌ Error in the pipeline:', err)
  }
}

run()
