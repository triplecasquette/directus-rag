/**
 * 02 - Embedding Test
 * Simple test: generate an embedding vector for a sample text using the BgeM3Embedder.
 * Prints the vector dimension and a preview.
 */

import { BgeM3Embedder } from "~/src/domain/embedding/BgeM3Embedder"

const main = async () => {
  const embedder = new BgeM3Embedder()
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
