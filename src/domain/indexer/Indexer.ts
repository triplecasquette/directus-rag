import type { IChunker } from '../chunking/IChunker.ts'
import type { IEmbedder } from '../embedding/IEmbedder.ts'
import type { IVectorStore } from '../vector-store/IVectorStore.ts'
import { documentChunksToQdrantPoints } from '../vector-store/mappers/documentChunksToQdrantPoints.ts'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Indexer orchestrates the full indexing pipeline: chunking, embedding, and vector store insertion.
 */
export class Indexer {
  constructor(
    private readonly chunker: IChunker,
    private readonly embedder: IEmbedder,
    private readonly vectorStore: IVectorStore,
    private readonly fetchExistingChunkIds: (collectionUrl: string, collection: string, ids: string[]) => Promise<Set<string>>
  ) {}

  /**
   * Index all markdown files in a directory tree.
   * @param rootDir - Root directory to search for markdown files
   * @param collectionUrl - Vector store base URL
   * @param collectionName - Vector store collection name
   */
  async indexAllDocs(rootDir: string, collectionUrl: string, collectionName: string): Promise<void> {
    const allMdFiles = await this.getAllMarkdownFiles(rootDir)
    let totalChunks = 0
    let totalVectors = 0
    let totalFiles = 0
    let totalSkipped = 0
    let totalIndexed = 0

    for (const filePath of allMdFiles) {
      try {
        const chunks = await this.chunker.chunk(filePath)
        if (!chunks.length) continue
        const ids = chunks.map(c => c.id)
        // Check which IDs already exist
        const existingIds = await this.fetchExistingChunkIds(collectionUrl, collectionName, ids)
        // Filter new and skipped chunks
        const newChunks = chunks.filter(c => !existingIds.has(c.id))
        const skippedChunks = chunks.filter(c => existingIds.has(c.id))

        skippedChunks.forEach(c => {
          console.log(`⏩ Chunk already in base, skipped: ${c.id} | ${c.metadata.source} | ${c.metadata.heading} | ${c.metadata.index}`)
        })
        newChunks.forEach(c => {
          console.log(`🆕 Chunk indexed: ${c.id} | ${c.metadata.source} | ${c.metadata.heading} | ${c.metadata.index}`)
        })

        // Only embed/index new chunks
        const texts = newChunks.map(c => c.content)
        const vectors = await Promise.all(texts.map(text => this.embedder.embed(text)))
        vectors.forEach((vec, i) => {
          if (!Array.isArray(vec) || vec.length === 0) {
            console.warn(`⚠️ Empty or invalid vector at chunk ${newChunks[i].id} (${newChunks[i].metadata.source})`)
          }
        })
        const points = documentChunksToQdrantPoints(newChunks, vectors)
        if (points.length > 0) {
          await this.vectorStore.addDocuments(points)
        }
        totalChunks += chunks.length
        totalVectors += vectors.length
        totalFiles++
        totalSkipped += skippedChunks.length
        totalIndexed += newChunks.length
        console.log(`✅ ${filePath} → ${newChunks.length} chunks indexed, ${skippedChunks.length} skipped`)
      } catch (err) {
        console.warn(`⚠️  Indexing error: ${filePath}\n→ ${err}`)
      }
    }

    console.log(`\n📦 Chunks generated: ${totalChunks} (from ${totalFiles} files)`)
    console.log(`📐 Vectors generated: ${totalVectors}`)
    console.log(`⏩ Chunks skipped (already in base): ${totalSkipped}`)
    console.log(`🆕 Chunks actually indexed: ${totalIndexed}`)
  }

  private async getAllMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) return this.getAllMarkdownFiles(path)
        if (entry.isFile() && path.endsWith('.md')) return [path]
        return []
      })
    )
    return files.flat()
  }
} 