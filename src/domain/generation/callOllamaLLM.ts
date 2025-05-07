// src/domain/generation/callOllamaLLM.ts

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'

export const callOllamaLLM = async (
  prompt: string,
  model: string,
  options?: {
    temperature?: number
    stop?: string[]
    max_tokens?: number
  }
): Promise<string> => {
  const body = {
    model,
    prompt,
    stream: false,
    temperature: options?.temperature ?? 0.7,
    stop: options?.stop,
    max_tokens: options?.max_tokens,
  }

  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`[LLM] Failed: ${res.status} - ${error}`)
  }

  const data = await res.json()
  return data.response || data.generated_text || ''
}
