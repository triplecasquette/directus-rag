import type { IVectorStore } from './IVectorStore.ts'
import { QdrantVectorStore } from './QdrantVectorStore.ts'

export function createVectorStore(type: string, options: any): IVectorStore {
  switch (type) {
    case 'qdrant':
      return new QdrantVectorStore(options.url, options.collectionName)
    // case 'pinecone':
    //   return new PineconeVectorStore(options)
    default:
      throw new Error('Unknown vector store type: ' + type)
  }
} 