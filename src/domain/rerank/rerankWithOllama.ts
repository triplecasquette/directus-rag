export async function rerankWithOllama(question: string, chunks: string[]) {
  const reranked: { chunk: string; score: number }[] = [];

  for (const chunk of chunks) {
    const body = {
      model: "qllama/bge-reranker-v2-m3",
      prompt: JSON.stringify({
        query: question,
        passage: chunk
      })
    };

    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // Adapte ici selon la vraie réponse du modèle
    const score = parseFloat(data.response || data.message?.content || "0");
    reranked.push({ chunk, score });
  }

  // Trie les chunks par score décroissant
  return reranked.sort((a, b) => b.score - a.score);
}