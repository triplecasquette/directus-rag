import type { DocumentChunk } from '../../../types/types.ts'
import type { ChunkPayload, QdrantPoint } from '../IVectorStore.ts'

export const documentChunksToQdrantPoints = (
  chunks: DocumentChunk[],
  vectors: number[][], // aligné 1-1 avec chunks
  lang: string = 'en'
): QdrantPoint[] => {
  if (chunks.length !== vectors.length) {
    throw new Error(`Mismatch: ${chunks.length} chunks vs ${vectors.length} vectors`)
  }

  return chunks.map((chunk, i): QdrantPoint => {
    const payload: ChunkPayload = {
      text: chunk.content,
      source: chunk.metadata.source,
      section: chunk.metadata.heading,
      lang,
      tokens: chunk.content.split(/\s+/).length // simple approximation
    }

    return {
      id: chunk.id,
      vector: vectors[i],
      payload
    }
  })
}
