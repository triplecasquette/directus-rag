/**
 * Payload for a vector store point (document chunk metadata).
 */
export type ChunkPayload = {
  text: string
  source: string
  section?: string
  lang?: string
  tokens?: number
}

/**
 * Structure of a point in a vector store (e.g. Qdrant).
 */
export type QdrantPoint = {
  id: string
  vector: number[]
  payload: ChunkPayload
  score?: number
}

/**
 * Interface for a vector store (semantic database).
 * Implementations provide methods to add and search points.
 */
export interface IVectorStore {
  /**
   * Add documents (points) to the vector store.
   * @param points - Array of points to add
   */
  addDocuments(points: QdrantPoint[]): Promise<void>

  /**
   * Search for similar points given a query vector.
   * @param query - The query vector
   * @param topK - Number of results to return
   * @returns Promise resolving to an array of QdrantPoint
   */
  search(query: number[], topK?: number): Promise<QdrantPoint[]>
} 