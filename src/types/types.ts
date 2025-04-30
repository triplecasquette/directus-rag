export type DocumentChunk = {
  id: string
  content: string
  metadata: {
    source: string       // e.g. markdown file name
    heading?: string     // e.g. section title
    index: number        // position in the file
  }
}

export interface VectorStore {
  addDocuments: (docs: DocumentChunk[]) => Promise<void>
  similaritySearch: (query: string, k: number) => Promise<DocumentChunk[]>
}

export interface Embedder {
  embed: (text: string) => Promise<number[]>
}
