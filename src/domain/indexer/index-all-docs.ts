import { MarkdownChunker } from '../chunking/MarkdownChunker.ts'
import { GenericEmbedder } from '../embedding/GenericEmbedder.ts'
import { createVectorStore } from '../vector-store/VectorStoreFactory.ts'
import { Indexer } from './Indexer.ts'

const ROOT = 'data/directus-docs'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;
const fetchExistingChunkIds = async (qdrantUrl: string, collection: string, ids: string[]): Promise<Set<string>> => {
  // Filter only valid UUIDs
  const validIds = ids.filter(id => UUID_REGEX.test(id));
  if (validIds.length === 0) return new Set();
  const res = await fetch(`${qdrantUrl}/collections/${collection}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: validIds })
  });
  if (res.status === 404) {
    // No points found or collection empty
    return new Set();
  }
  if (!res.ok) throw new Error(`[Qdrant] Failed to fetch existing IDs: ${res.status}`);
  const data = await res.json();
  return new Set((data.result || []).map((pt: any) => pt.id));
}

const main = async () => {
  const chunker = new MarkdownChunker()
  const embedder = new GenericEmbedder()
  const vectorStore = createVectorStore(process.env.VECTOR_BACKEND || 'qdrant', {
    url: process.env.VECTORSTORE_URL || 'http://localhost:6333',
    collectionName: process.env.VECTOR_COLLECTION_NAME || 'docs_chunks'
  })
  const qdrantUrl = process.env.VECTORSTORE_URL || 'http://localhost:6333'
  const collectionName = process.env.VECTOR_COLLECTION_NAME || 'docs_chunks'

  const indexer = new Indexer(chunker, embedder, vectorStore, fetchExistingChunkIds)
  await indexer.indexAllDocs(ROOT, qdrantUrl, collectionName)
}

main().catch(console.error)
