# 📚 RAG Directus

A local, open-source Retrieval-Augmented Generation (RAG) system integrated with the official Directus documentation. Ask questions in natural language and get contextual, documentation-grounded answers—entirely on your own infrastructure.

---

## 🚀 Features

- **Local-first**: All models (LLM & embeddings) run locally via [Ollama](https://ollama.com/)
- **Fast semantic search**: Uses [Qdrant](https://qdrant.tech/) as a vector database
- **Markdown-native**: Indexes the official Directus documentation (`.md` files)
- **Nuxt Frontend**: Modern, minimal chat interface
- **Modular architecture**: Easily swap out models or storage
- **Testable**: All core logic is covered by isolated tests

---

## 🧬 How It Works (Pipeline)

1. **User asks a question** in the chat interface
2. **Relevance check**: The system uses a local LLM to verify if the question is about Directus
3. **Embedding**: If relevant, the question is embedded into a vector (`bge-m3` via Ollama)
4. **Semantic search**: The vector is compared to all documentation chunks in Qdrant
5. **(Planned) Rerank**: Chunks are reranked for even better relevance
6. **Prompt building**: The most relevant chunks are formatted into a prompt
7. **LLM answer**: The prompt is sent to the local LLM (Dolphin3), which generates a contextual answer
8. **Display**: The answer is shown to the user, optionally with source references

---

## 🏗️ Project Structure

```
rag-directus/
├── components/           # Nuxt UI components (atoms, molecules, organisms)
├── data/directus-docs/   # Markdown documentation corpus
├── layouts/              # Nuxt layouts
├── pages/                # Nuxt pages (entry point)
├── public/               # Static assets
├── server/api/rag/       # API endpoints for RAG pipeline
├── src/
│   ├── domain/           # Core business logic (chunking, embedding, vector-store, etc.)
│   ├── scripts/          # Utility scripts & tests
│   ├── services/         # Service layer
│   ├── stores/           # State management
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── .env.example          # Example environment variables
├── nuxt.config.ts        # Nuxt configuration
├── docker-compose.yml    # (Optional) Docker setup
├── ROADMAP_RAG_DIRECTUS.md # Technical roadmap
└── README.md             # This file
```

---

## ⚡️ Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) or npm/yarn
- [Ollama](https://ollama.com/) (for local LLM & embedding models)
- [Qdrant](https://qdrant.tech/) (vector database, can run via Docker)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/rag-directus.git
cd rag-directus
```

### 2. Install dependencies
```bash
pnpm install
# or
npm install
```

### 3. Start Qdrant (Docker example)
```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

### 4. Start Ollama and pull required models
```bash
ollama serve
ollama pull bge-m3
ollama pull dolphin3
```

### 5. Configure environment variables
Copy `.env.example` to `.env` and adjust as needed (Qdrant URL, Ollama endpoints, etc).

For guidance on extending and using additional environment variables, see the [Contributing](#-contributing) section below.

### 6. Index the documentation
```bash
pnpm index:all
```

### 7. Run the Nuxt app
```bash
pnpm dev
# or
npm run dev
```

---

## 🧪 Testing

All business logic is covered by isolated tests:
- `01-chunking.test.ts` → checks splitting
- `02-embedding.test.ts` → checks embedding call to Ollama
- `03-qdrant.test.ts` → checks Qdrant vector store integration
- `04-index.test.ts` → checks full indexing pipeline
- `05-search.test.ts` → checks search functionality
- `06-generation.test.ts` → checks LLM generation pipeline

> Note: It is recommended to add real end-to-end and integration tests in the future to ensure the robustness of the entire pipeline.

Run tests and scripts individually:

```bash
# Run chunking tests
pnpm test:chunk

# Run embedding tests
pnpm test:embed

# Run Qdrant vector store tests
pnpm test:qdrant

# Run full indexing pipeline tests
pnpm test:index

# Run semantic search tests
pnpm test:search

# Run LLM generation tests
pnpm test:generate

# Utility: Clear all vectors in Qdrant
pnpm clear:qdrant

# Utility: Index all documentation (run after updating docs)
pnpm index:all
```

---

## 🛣️ Roadmap (MVP & Beyond)

See [`ROADMAP_RAG_DIRECTUS.md`](./ROADMAP_RAG_DIRECTUS.md) for the full technical roadmap.

- [x] Local chunking & embedding
- [x] Qdrant vector store integration
- [x] Minimalist Nuxt chat interface
- [ ] More focused documentation, less volume – to be challenged
- [ ] Reranking for improved relevance
- [~] Enriched answers with source links (partially implemented)
- [ ] Dockerization
- [ ] Native integration into Directus docs

---

## 🤝 Contributing

This project is designed to be **modular and extensible**. Contributors are encouraged to add new:
- **Chunkers** (for different document formats or splitting strategies)
- **Embedders** (for alternative embedding models or providers)
- **Vector stores** (for other vector database backends)
- **And any other improvements** that can make the project more powerful and usable for a wider audience

Feel free to open issues or pull requests for improvements, bugfixes, or new features!

---

## 📄 License

This software is licensed under the **CeCILL v2.1 License**, a free software license that complies with French law and is compatible with the GNU GPL.

You are permitted to use, modify, and distribute the software under the terms of the CeCILL License, provided that:

- The source code remains open and accessible.
- The original author(s) are credited.
- Any modifications or derivative works are licensed under the same CeCILL License.

For more details, see the complete license text at [CeCILL v2.1](https://www.cecill.info/licences.en.html).

### 📌 Exception for Directus

Notwithstanding the terms of the CeCILL License, Monospace, Inc. (Directus) is granted an unrestricted exception to use, modify, integrate, and redistribute this software **without any obligation to disclose the source code or modifications**, and without any copyleft restrictions.

- This exception applies solely to Directus and its affiliated entities.
- Directus is not required to release any modifications or derivative works based on this software.
- This exception is **non-transferable** and does not extend to third-party entities using Directus products or services.

Outside of this exception, the software remains under the CeCILL v2.1 License for all other uses and parties.
