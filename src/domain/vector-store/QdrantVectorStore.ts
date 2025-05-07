// rag/vector-store/QdrantVectorStore.ts

import type { IVectorStore, QdrantPoint } from './IVectorStore.ts'

/**
 * Qdrant vector store implementation.
 * Provides methods to add and search points in a Qdrant collection.
 */
export class QdrantVectorStore implements IVectorStore {
  constructor(
    private readonly url: string,
    private readonly collectionName: string
  ) {}

  async search(query: number[], topK = 5): Promise<QdrantPoint[]> {
    const body = {
      vector: query,
      top: topK,
      with_payload: true,
      with_vector: true,
      score_threshold: 0.6,
    }

    const res = await fetch(`${this.url}/collections/${this.collectionName}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Search failed: ${error}`)
    }

    const data = await res.json()

    /* console.log('\n📦 Raw Qdrant result:\n', JSON.stringify(data.result, null, 2)) */
    data.result.forEach((point: any, i: number) => {
      console.log(`#${i + 1} | score: ${point.score?.toFixed(4)} | source: ${point.payload?.source}`);
    });

    return data.result.map((point: any) => ({
      id: point.id,
      vector: point.vector,
      payload: point.payload,
      score: point.score
    }))
  }

  async addDocuments(points: QdrantPoint[]): Promise<void> {
    const payload = {
      points: points.map(({ id, vector, payload }) => ({
        id,
        vector,
        payload,
      })),
    }

    const res = await fetch(`${this.url}/collections/${this.collectionName}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to add documents: ${error}`)
    }
  }
}
