/**
 * Interface for a text embedder.
 * Implementations generate vector embeddings for input text.
 */
export interface IEmbedder {
  /**
   * Generate an embedding vector for the given text.
   * @param text - The input text
   * @returns Promise resolving to a vector (array of numbers)
   */
  embed(text: string): Promise<number[]>;
} 