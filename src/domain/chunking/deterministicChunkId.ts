import { v5 as uuidv5 } from 'uuid'

/**
 * Namespace UUID constant for deterministic UUID v5 generation.
 * Never change this value to ensure ID stability!
 */
export const DETERMINISTIC_CHUNK_NAMESPACE = 'b8a7b6e2-1c2d-4e3f-9a4b-5c6d7e8f9a0b'

/**
 * Generate a deterministic (UUID v5) ID for a document chunk.
 * The ID is based on the content, source, heading, and index.
 *
 * @param content - The chunk text
 * @param source - The source file name
 * @param heading - The section title (optional)
 * @param index - The chunk index in the file
 * @returns string - A stable and unique UUID v5
 */
export function deterministicChunkId(
  content: string,
  source: string,
  heading: string | undefined,
  index: number
): string {
  const data = `${source}::${heading || ''}::${index}::${content}`
  return uuidv5(data, DETERMINISTIC_CHUNK_NAMESPACE)
} 