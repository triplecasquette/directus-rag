import type { IEmbedder } from './IEmbedder.ts'
import { request } from 'undici'

/**
 * Generic embedder implementation using a local embedding API (Ollama).
 */
export class GenericEmbedder implements IEmbedder {
  private readonly model: string

  constructor(model?: string) {
    this.model = model || process.env.OLLAMA_EMBED_MODEL || 'bge-m3'
  }

  async embed(text: string): Promise<number[]> {
    const res = await request('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: text
      })
    })

    if (res.statusCode !== 200) {
      throw new Error(`[Embedding] Failed with status ${res.statusCode}`)
    }

    const body = await res.body.json() as { embedding: number[] }

    if (!body?.embedding || !Array.isArray(body.embedding)) {
      throw new Error('[Embedding] Invalid response format')
    }

    return body.embedding
  }
}
