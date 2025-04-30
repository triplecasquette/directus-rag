# 📚 RAG Directus — Roadmap Technique Complète

## 🎯 Objectif du projet

Développer un système RAG (Retrieval-Augmented Generation) **local, open source, et intégré à la documentation de Directus**.  
Le MVP doit permettre de poser une question en langage naturel et obtenir une réponse contextuelle à partir des fichiers `.md` de la documentation officielle, hébergée sur GitHub.

Public cible : anglophone → international  
Modèle LLM : local via Ollama (ex : Dolphin)  
Embedding : local via `nomic-embed-text`  
Vector store : Qdrant (auto-hébergeable)

## 📦 Stack technique choisie

| Composant             | Choix validé             | Raison                                                                 |
|-----------------------|--------------------------|------------------------------------------------------------------------|
| Frontend              | Nuxt (latest)            | Facilité d'intégration dans la doc Directus (également en Nuxt)       |
| Chunking              | Custom TypeScript        | Découpe logique sur base Markdown (`##`, paragraphes, overlap soft)   |
| Embedding             | `nomic-embed-text` (Ollama)| Local, rapide, adapté à l’anglais, 768-dim, suffisant pour MVP         |
| Vector store          | Qdrant                   | API simple, open source, compatible cloud/on-prem, meilleur qu’un Postgres + pgvector pour ce cas |
| LLM                   | Dolphin (Ollama)         | Modèle local, français compréhensible, performance raisonnable         |
| Architecture          | DDD légère / SOLID       | Permet de switcher chaque brique sans tout réécrire                    |
| Format de chunk       | Markdown `.md`           | Fichiers extraits de la doc GitHub de Directus                        |
| Mode de build         | TypeScript ESM + `ts-node/esm` | Full typé, import explicite `.ts`, scripts en `scripts/`            |

## ✅ Étapes terminées

### 1. 🔧 Setup initial
- Projet Nuxt démarré
- Fichiers `.ts` stricts avec ESM (`allowImportingTsExtensions`)
- Structure DDD `rag/` posée (`chunking/`, `embedding/`, `domain/`…)

### 2. 🧱 Chunking
- Découpage des `.md` par `##` (sections)
- Re-split auto en paragraphes si trop gros (> 500 tokens)
- Option d’overlap textuel implémentée mais désactivée pour la V1
- `DocumentChunk` typé proprement
- Testé via `scripts/test-chunk.ts`

### 3. 🔢 Embedding local
- Classe `NomicEmbedder` implémentant `Embedder`
- Appel vers `http://localhost:11434/api/embeddings`
- Fonctionne avec Ollama
- Format vectoriel : `number[]` de taille 768
- Testé avec `scripts/test-embed.ts`

## 🔜 Étapes à réaliser

### 4. 🧠 Qdrant Vector Store

#### Fichier à créer : `rag/vector/QdrantVectorStore.ts`

#### Méthodes à implémenter :
- `addDocuments(chunks: DocumentChunk[]): Promise<void>`
- `search(query: string): Promise<SearchResult[]>`

#### Contraintes :
- Utilisation de l’API REST Qdrant (`http://localhost:6333`)
- Index basé sur les `embeddings` générés
- Chaque document doit stocker les `metadata` (source, heading…)

### 5. 📦 Indexation complète du corpus

#### Script à créer : `scripts/index-all-docs.ts`

Tâches :
- Lire tous les `.md` dans `data/`
- Chunker chaque fichier
- Embeder chaque chunk
- Indexer via `QdrantVectorStore`

### 6. 💬 Interface RAG minimaliste

Composant : `ChatRAG.vue` dans `Nuxt`

Fonction :
- Input utilisateur (question)
- `embed()` la question
- `search()` dans Qdrant
- Concatène les chunks en prompt
- Envoie à un LLM (Dolphin)
- Affiche la réponse

Bonus : 
- Ajouter les `source` dans la réponse (liens, titres) → V2

## 🧠 Décisions stratégiques

- **Langue cible :** anglais uniquement pour la V1
- **Multilingue :** prévu pour une V2 (via traduction ou embeddings parallèles)
- **Pas de dépendance cloud** → full local ou auto-hébergeable
- **Pas de sous-chunking par tokens** → paragraphes suffisent pour la doc Directus
- **Extensibilité prévue** → tous les composants sont abstraits via interfaces

## 💡 Architecture métier

```ts
// Exemple d’interface d’abstraction
export interface Embedder {
  embed(text: string): Promise<number[]>
}

export interface VectorStore {
  addDocuments(docs: DocumentChunk[]): Promise<void>
  search(query: string): Promise<SearchResult[]>
}
```

## 📂 Arborescence actuelle

```
/rag-directus
├── /rag
│   ├── /chunking
│   ├── /embedding
│   ├── /vector         ← À créer
│   ├── /domain
├── /scripts
│   ├── test-chunk.ts
│   ├── test-embed.ts
│   └── index-all-docs.ts ← À créer
├── /data
│   └── directus-docs/ ← Markdown source
```

## 🧪 Tests

Tous les composants métiers sont testables isolément :
- `test-chunk.ts` → vérifie découpage
- `test-embed.ts` → vérifie appel embedding Ollama
- À venir : `test-search.ts` pour Qdrant

## 🏁 Objectif MVP

1. Poser une question
2. Elle est embedée → comparée aux chunks
3. Le LLM répond à partir des passages pertinents

## 🔁 Post-MVP envisagé

- Webhook GitHub pour réindexation auto
- Multilingue (langchain-style)
- Format enrichi (liens vers sources, métadonnées)
- Dockerisation
- Intégration native dans `directus/docs`
