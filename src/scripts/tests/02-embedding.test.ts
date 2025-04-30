/**
 * 02 - Embedding Test
 * Simple test: generate an embedding vector for a sample text using the GenericEmbedder.
 * Prints the vector dimension and a preview.
 */
import { GenericEmbedder } from '../../domain/embedding/GenericEmbedder.ts'

const main = async () => {
  const embedder = new GenericEmbedder()
  const text = 'Directus is an open-source data platform for managing content, users, and more.'
  const vector = await embedder.embed(text)

  if (!vector || !Array.isArray(vector)) {
    console.log('No embedding generated.')
    return
  }

  console.log('Embedding dimension:', vector.length)
  console.log('Preview:', vector.slice(0, 8).map(v => v.toFixed(4)).join(', '), '...')
}

main()
