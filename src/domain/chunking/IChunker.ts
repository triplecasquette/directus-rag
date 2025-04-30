import type { DocumentChunk } from '../../types/types'

/**
 * Interface for a document chunker.
 * Implementations split a file into semantic or fixed-size chunks.
 */
export interface IChunker {
  /**
   * Split a file into chunks.
   * @param filePath - Path to the file to chunk
   * @returns Promise resolving to an array of DocumentChunk
   */
  chunk(filePath: string): Promise<DocumentChunk[]>
} 