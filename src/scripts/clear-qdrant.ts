/**
 * Script to clear all points from the 'docs_chunks' collection in Qdrant.
 * Useful for resetting the vector database during development or testing.
 */
const clearCollection = async () => {
  const res = await fetch('http://localhost:6333/collections/docs_chunks/points/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filter: {} }), // deletes all points
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`❌ Failed to clear collection: ${error}`)
  }

  console.log('🧹 Collection `docs_chunks` successfully cleared.')
}

clearCollection().catch(console.error)
