import type { IEmbedder } from './IEmbedder.ts'
import { request } from 'undici'

const cleanText = (text: string): string => {
  return text
    .replace(/---[\s\S]*?---/g, '') // Retire le frontmatter YAML
    .replace(/:[\w-]+\{[^}]*\}/g, '') // Retire les shortcodes :partial{}, :icon{}, etc.
    .replace(/::[\w-]+\{[^}]*\}[\s\S]*?::/g, '') // Retire les blocs callout ::callout{}::
    .trim()
}

/**
 * Specific embedder implementation using bge-m3 from a local embedding API (Ollama).
 */
export class BgeM3Embedder implements IEmbedder {
  private readonly model: string

  constructor(model?: string) {
    this.model = model || process.env.OLLAMA_EMBED_MODEL || 'bge-m3'
  }

  async embed(text: string): Promise<number[]> {
    const cleanedText = cleanText(text).trim()
    
    if (!cleanedText || cleanedText.length < 10) {
      throw new Error(`[Embedding] Cleaned text too short or empty: "${cleanedText}"`)
    }
  
    const res = await request('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: cleanedText
      })
    })
  
    if (res.statusCode !== 200) {
      throw new Error(`[Embedding] Failed with status ${res.statusCode}`)
    }
  
    const body = await res.body.json() as { embedding: number[] }
  
    // Vérifier si "embedding" est valide et contient des données
    if (!body?.embedding || !Array.isArray(body.embedding) || body.embedding.length === 0) {
      throw new Error('[Embedding] Empty or invalid response format')
    }
  
    return body.embedding
  }  
}
