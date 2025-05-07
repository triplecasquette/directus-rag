export type RagSource = {
  id: string
  payload: {
    text: string
    source: string
    section?: string
    lang: string
    tokens: number
  }
  score: number
}

export type RagResponse = {
  answer: string
  sources: RagSource[]
}
