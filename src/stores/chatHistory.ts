import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatHistoryStore = defineStore('chatHistory', () => {
  const history = ref<{
    question: string
    answer: string
    sources: any[]
    error?: string | null
  }[]>([
    {
      question: '',
      answer: "Welcome, I'm Directus Assistant. What can I do for you?",
      sources: [],
      error: undefined
    }
  ])
  return { history }
})