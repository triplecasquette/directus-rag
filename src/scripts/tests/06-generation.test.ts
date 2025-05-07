/**
 * 06 - RAG Generation Pipeline Test
 * End-to-end test: asks a question, embeds it, searches the vector store (Qdrant), builds a prompt, calls the LLM (Ollama), and prints the generated answer.
 * Shows detailed logs: user question, number of retrieved passages, prompt preview, and generated answer.
 */
import { createVectorStore } from '../../domain/vector-store/VectorStoreFactory.ts'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { BgeM3Embedder } from '~/src/domain/embedding/BgeM3Embedder.ts'

const VECTORSTORE_URL = process.env.VECTORSTORE_URL || 'http://localhost:6333'
const VECTOR_COLLECTION_NAME = process.env.VECTOR_COLLECTION_NAME || 'docs_chunks'
const LLM_MODEL = process.env.RAG_LLM_GENERATION_MODEL || 'dolphin3'
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'
const TOP_K = parseInt(process.env.RAG_TOP_K || '5', 10)

/**
 * Build a prompt for the LLM using the question and retrieved documentation contexts.
 * @param question - The user question
 * @param contexts - Array of context passages
 * @returns The prompt string
 */
const buildPrompt = (question: string, contexts: {text: string, source: string, section?: string}[]) => {
  const contextText = contexts.map(
    c => `Source: ${c.source}${c.section ? ', section: ' + c.section : ''}\n${c.text}`
  ).join('\n\n')
  return `You are a helpful assistant. Use only the following documentation to answer the user's question. Reformulate the answer in your own words, do not copy-paste or quote the documentation, and do not mention the sources or passages directly in your answer.\n\nDocumentation:\n${contextText}\n\nQuestion: ${question}\nAnswer:`
}

/**
 * Ask a question to the user via the command line.
 * @param prompt - The prompt to display
 * @returns The user's answer
 */
async function askQuestion(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input, output })
  const answer = await rl.question(prompt)
  rl.close()
  return answer
}

/**
 * Call the Ollama LLM API with a prompt and return the generated answer.
 * @param prompt - The prompt to send
 * @param model - The LLM model name
 * @returns The generated answer
 */
async function callOllamaLLM(prompt: string, model: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  })
  if (!res.ok) throw new Error(`[LLM] Failed: ${res.status}`)
  const data = await res.json()
  return data.response || data.generated_text || ''
}

/**
 * Main test script to perform a full RAG pipeline: user question → embedding → search → LLM answer.
 */
async function main() {
  const vectorStore = createVectorStore(process.env.VECTOR_BACKEND || 'qdrant', {
    url: VECTORSTORE_URL,
    collectionName: VECTOR_COLLECTION_NAME
  })
  const embedder = new BgeM3Embedder()

  const question = await askQuestion('❓ Enter your question for the Directus docs: ')
  console.log('\n--- User question ---')
  console.log(question)

  const queryVec = await embedder.embed(question)
  const results = await vectorStore.search(queryVec, TOP_K)

  console.log(`\n--- Retrieved ${results.length} passage(s) from the vector store ---`)
  if (!results.length) {
    console.log('No relevant passage found in the vector database.')
    return
  }

  const prompt = buildPrompt(question, results.map(r => ({
    text: r.payload.text,
    source: r.payload.source,
    section: r.payload.section
  })))

  console.log('\n--- Prompt sent to the LLM ---\n')
  console.log(prompt)
  console.log('\n--- Generating answer... ---\n')

  const answer = await callOllamaLLM(prompt, LLM_MODEL)
  console.log('\n🦙 Generated answer:\n')
  console.log(answer)
}

main().catch(console.error) 