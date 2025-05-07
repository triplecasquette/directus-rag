# 📚 RAG Directus — Complete Technical Roadmap

## 🎯 Project Objective

Develop a RAG (Retrieval-Augmented Generation) system that is **local, open source, and integrated with the Directus documentation**.  
The MVP should allow users to ask a question in natural language and receive a contextual answer based on the `.md` files from the official documentation hosted on GitHub.

Target audience: English-speaking → international  
LLM model: local via Ollama (e.g., Dolphin)  
Embedding: local via `bge-m3`  
Vector store: Qdrant (self-hostable)

## 📦 Chosen Tech Stack

| Component             | Validated Choice            | Reason                                                                 |
|-----------------------|-----------------------------|------------------------------------------------------------------------|
| Frontend              | Nuxt (latest)               | Easy integration into Directus docs (also in Nuxt)                     |
| Chunking              | Custom TypeScript           | Logical split based on Markdown (`##`, paragraphs, soft overlap)       |
| Embedding             | `bge-m3` (Ollama)           | Local, fast, suitable for English, 1024-dim, sufficient for MVP        |
| Vector store          | Qdrant                      | Simple API, open source, cloud/on-prem compatible,
better than Postgres + pgvector for this use case |
| LLM                   | Dolphin (Ollama)            | Local model, reasonable performance, can understand French             |
| Architecture          | Lightweight DDD / SOLID     | Allows swapping any component without rewriting everything             |
| Chunk format          | Markdown `.md`              | Files extracted from Directus GitHub docs                              |
| Build mode            | TypeScript ESM + `ts-node/esm` | Fully typed, explicit `.ts` imports, scripts in `scripts/`          |

## ✅ Completed Steps

### 1. 🔧 Initial Setup
- Nuxt project started
- Strict `.ts` files with ESM (`allowImportingTsExtensions`)
- DDD structure `rag/` set up (`chunking/`, `embedding/`, `domain/`…)

### 2. 🧱 Chunking
- Splitting `.md` files by `##` (sections)
- Auto re-split into paragraphs if too large (> 500 tokens)
- Textual overlap option implemented but disabled for V1
- Cleanly typed `DocumentChunk`
- Tested via `scripts/test-chunk.ts`

### 3. 🔢 Local Embedding
- `NomicEmbedder` class implementing `Embedder`
- Calls `http://localhost:11434/api/embeddings`
- Works with Ollama
- Vector format: `number[]` of size 768
- Tested with `scripts/test-embed.ts`

## 🔜 Next Steps

### 4. 🧠 Qdrant Vector Store

#### File to create: `rag/vector/QdrantVectorStore.ts`

#### Methods to implement:
- `addDocuments(chunks: DocumentChunk[]): Promise<void>`
- `search(query: string): Promise<SearchResult[]>`

#### Constraints:
- Use Qdrant REST API (`http://localhost:6333`)
- Index based on generated `embeddings`
- Each document must store `metadata` (source, heading, etc.)

### 5. 📦 Full Corpus Indexing

#### Script to create: `scripts/index-all-docs.ts`

Tasks:
- Read all `.md` files in `data/`
- Chunk each file
- Embed each chunk
- Index via `QdrantVectorStore`

### 6. 💬 Minimalist RAG Interface

Component: `ChatRAG.vue` in `Nuxt`

Function:
- User input (question)
- `embed()` the question
- `search()` in Qdrant
- Concatenate chunks into prompt
- Send to an LLM (Dolphin)
- Display the answer

Bonus: 
- Add `source` in the answer (links, titles) → V2

## 🧠 Strategic Decisions

- **Target language:** English only for V1
- **Multilingual:** planned for V2 (via translation or parallel embeddings)
- **No cloud dependency** → fully local or self-hostable
- **No sub-chunking by tokens** → paragraphs are enough for Directus docs
- **Planned extensibility** → all components are abstracted via interfaces

## 💡 Business Architecture

```ts
// Example abstraction interface
export interface Embedder {
  embed(text: string): Promise<number[]>
}

export interface VectorStore {
  addDocuments(docs: DocumentChunk[]): Promise<void>
  search(query: string): Promise<SearchResult[]>
}
```

## 📂 Current Structure

```
/rag-directus
/rag-directus
├── components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── svg/
├── data
│   └── directus-docs/
├── layouts
│   └── default.vue
├── pages
│   └── index.vue
├── public
│   ├── favicon.ico
│   ├── robots.txt
│   └── fonts/
├── server
│   └── api
│       └── rag/
│           ├── ask.post.ts
│           └── callRagPipeline.ts
├── src
│   ├── assets/
│   ├── domain/
│   │   ├── chunking/
│   │   ├── embedding/
│   │   ├── generation/
│   │   ├── indexer/
│   │   ├── rerank/
│   │   └── vector-store/
│   ├── schemas/
│   ├── scripts/
│   │   ├── clear-qdrant.ts
│   │   └── tests/
│   │       ├── 01-chunking.test.ts
│   │       ├── 02-embedding.test.ts
│   │       ├── 03-qdrant.test.ts
│   │       ├── 04-index.test.ts
│   │       ├── 05-search.test.ts
│   │       └── 06-generation.test.ts
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
├── .editorconfig
├── .env.example
├── .gitignore
├── app.vue
├── docker-compose.yml
├── eslint.config.mjs
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.cjs
├── README.md
├── ROADMAP_RAG_DIRECTUS.md
└── tsconfig.json
```

## 🧪 Tests

All business components are testable in isolation:
- `01-chunking.test.ts` → checks splitting
- `02-embedding.test.ts` → checks embedding call to Ollama
- `03-qdrant.test.ts` → checks Qdrant vector store integration
- `04-index.test.ts` → checks full indexing pipeline
- `05-search.test.ts` → checks search functionality
- `06-generation.test.ts` → checks LLM generation pipeline

## 🏁 MVP Objective

1. The user asks a question
2. The system checks if the question is about Directus (LLM filter)
3. If relevant, the question is embedded into a vector
4. The vector is compared to documentation chunks (semantic search)
5. (Planned) Chunks are reranked for better relevance
6. The most relevant chunks are formatted into a prompt
7. The prompt is sent to the LLM, which generates an answer

## 🔁 Post-MVP Ideas

- Multilingual (langchain-style)
- Enriched format (links to sources, metadata) -> first steps already here
- Dockerization
- Native integration into `directus/docs`
