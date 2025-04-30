# 📚 RAG Directus — MVP Plan

## ✅ Étapes déjà réalisées

### ✅ 1. Setup du projet
- Nuxt initialisé
- Arborescence `rag/` modulaire
- Dossier `scripts/` pour les tests manuels
- Config TypeScript strict en ESM

### ✅ 2. Chunking Markdown
- Script `chunkMarkdownFile.ts`
- Découpe par `##` (sections)
- Re-chunk automatique si trop gros
- Overlap textuel par dernier paragraphe
- Token limit : 500
- Tests passés dans `scripts/test-chunk.ts`

### ✅ 3. Embedding local
- `NomicEmbedder.ts` conforme à l’interface `Embedder`
- Appel local via Ollama (`nomic-embed-text`)
- Embedding de 768 dimensions vérifié
- Script de test dans `scripts/test-embed.ts`

---

## 🔜 Étapes à venir

### 🔸 4. Vector Store
- [ ] Créer `QdrantVectorStore.ts`
- [ ] Implémenter `addDocuments(chunks: DocumentChunk[])`
- [ ] Implémenter `search(query: string): Promise<...>`

### 🔸 5. Indexation complète
- [ ] Créer `scripts/index-all-docs.ts`
- [ ] Lire tous les `.md` depuis `/data/`
- [ ] Chunker + Embedder + Stocker

### 🔸 6. Interface de requête
- [ ] Poser un composant `ChatRAG.vue`
- [ ] Entrée utilisateur → `search()`
- [ ] Appel LLM → réponse
- [ ] Format minimal : réponse simple (liens en V2)

---

## 🧠 Notes

- Objectif MVP : RAG local, auto-hébergeable
- Ciblage initial : **anglais only**, multilingue en V2
- Architecture SOLID-friendly : abstraction des dépendances
- Ollama + Qdrant = Full local
- Tous les composants testables isolément via `scripts/`

---