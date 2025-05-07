import { createVectorStore } from '~/src/domain/vector-store/VectorStoreFactory'
import type { QdrantPoint } from '~/src/domain/vector-store/IVectorStore'
import { buildPrompt } from '~/src/domain/generation/buildPrompt'
import { callOllamaLLM } from '~/src/domain/generation/callOllamaLLM'
import { BgeM3Embedder } from '~/src/domain/embedding/BgeM3Embedder'
import { rerankWithOllama } from '~/src/domain/rerank/rerankWithOllama'

const VECTORSTORE_URL = process.env.VECTORSTORE_URL || 'http://localhost:6333'
const VECTOR_COLLECTION_NAME = process.env.VECTOR_COLLECTION_NAME || 'docs_chunks'
const LLM_MODEL = process.env.RAG_LLM_GENERATION_MODEL || 'dolphin3'
const TOP_K = parseInt(process.env.RAG_TOP_K || '5', 10)

export const callRagPipeline = async (question: string): Promise<{
  answer: string
  sources: QdrantPoint[]
}> => {
  // Step 1: Embed the question using the BgeM3 embedder
  const embedder = new BgeM3Embedder()
  const queryVec = await embedder.embed(question)

  // Step 2: Create a vector store instance (Qdrant)
  const vectorStore = createVectorStore('qdrant', {
    url: VECTORSTORE_URL,
    collectionName: VECTOR_COLLECTION_NAME
  })

  // Step 3: Search for the most relevant chunks in the vector store
  const results = await vectorStore.search(queryVec, TOP_K)
  const chunks = results.map(r => r.payload.text)

  // Step 4: Rerank the retrieved chunks using the LLM
  const reranked = await rerankWithOllama(question, chunks)
  const bestChunks = reranked.slice(0, TOP_K)

  // Step 5: Map the best chunks back to their original sources
  const sources = bestChunks.map(bc => {
    const idx = chunks.indexOf(bc.chunk)
    return results[idx]
  })

  // Step 6: Build the prompt for the LLM using the best chunks
  const prompt = buildPrompt(
    question,
    bestChunks.map(bc => {
      const idx = chunks.indexOf(bc.chunk)
      const r = results[idx]
      return{
      text: r.payload.text,
      source: r.payload.source,
      section: r.payload.section
    }}
  ))

  // Step 7: Generate the answer using the LLM
  const answer = await callOllamaLLM(prompt, LLM_MODEL, {
    temperature: 0.2,
  })

  // Step 8: Return the answer and the sources used
  return {
    answer,
    sources
  }
}
