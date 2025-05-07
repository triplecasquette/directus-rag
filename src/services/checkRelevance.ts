import { callOllamaLLM } from "../domain/generation/callOllamaLLM"


const buildRelevancePrompt = (question: string): string => `
You are a filter placed before a documentation assistant.
The assistant only answers questions about the Directus platform (CMS, API, SDK, configuration, permissions, etc.).

Assume the user is on the official Directus documentation site.
Determine whether the following question is meant to be about Directus.

Answer strictly with "yes" or "no". Do not explain.

Question: ${question}
Answer:
`.trim()

export const checkRelevanceToDirectus = async (question: string): Promise<boolean> => {
  const prompt = buildRelevancePrompt(question)

  const result = await callOllamaLLM(prompt, process.env.RAG_LLM_SAFEGUARD_MODEL || 'llama3:latest', {
    temperature: 0,
    max_tokens: 2,
    stop: ['\n']
  })
  

  const answer = result.trim().toLowerCase()
  return ['yes'].includes(answer)
}
