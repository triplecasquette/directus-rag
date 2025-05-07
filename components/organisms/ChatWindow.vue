<script setup lang="ts">
import { ref, watch } from 'vue'
import ChatInput from '../atoms/ChatInput.vue'
import ChatMessage from '../molecules/ChatMessage.vue'
import { useChatHistoryStore } from '~/src/stores/chatHistory'
import { checkRelevanceToDirectus } from '~/src/services/checkRelevance'
import { usePipelineStepStore } from '~/src/stores/pipelineStep'
const chatHistoryStore = useChatHistoryStore()
const pipelineStepStore = usePipelineStepStore()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const question = ref('')
const { answer, sources, error, ask } = useRagChat()

// Historique des échanges
// Chaque entrée contient la question, la réponse, les sources et l'erreur éventuelle
interface ChatEntry {
  question: string
  answer: string
  sources: any[]
  error?: string | null
}

// Ajoute la réponse à l'historique dès qu'elle arrive
watch(
  () => answer.value,
  (newAnswer) => {
    if (newAnswer && chatHistoryStore.history.length > 0) {
      // Met à jour la dernière entrée avec la réponse
      const last = chatHistoryStore.history[chatHistoryStore.history.length - 1]
      if (last.answer === '') {
        last.answer = newAnswer
        last.sources = sources.value
        last.error = error.value
      }
    }
  }
)

const submit = async () => {
  if (question.value.trim()) {
    // Ajoute la question à l'historique, réponse vide pour l'instant
    chatHistoryStore.history.push({
      question: question.value,
      answer: '',
      sources: [],
      error: undefined
    })
    const currentQuestion = question.value
    question.value = '' // Vide l'input
    // Pipeline steps
    pipelineStepStore.setStep('checking')
    await nextTick()
    const isRelevant = await checkRelevanceToDirectus(currentQuestion)
    if (!isRelevant) {
      // Ajoute l'erreur à la dernière entrée déjà créée
      const last = chatHistoryStore.history[chatHistoryStore.history.length - 1]
      if (last && last.answer === '' && last.question === currentQuestion) {
        last.error = "Whoops! I'm built for Directus questions only — happy to help with those!"
      }
      pipelineStepStore.setStep('idle')
      return
    }
    pipelineStepStore.setStep('sourcing')
    await nextTick()
    
    await ask(currentQuestion)
    await nextTick()
    pipelineStepStore.setStep('idle')
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-40 bg-black/50 flex items-center justify-center"
    @keydown.esc="emit('close')"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-2xl bg-gray-900 text-white rounded-lg shadow-xl flex flex-col min-h-[40vh] max-h-[90vh]"
    >
      <!-- Header -->
      <header class="px-6 py-4 border-b border-white/10 flex justify-between items-center shrink-0">
        <h2 class="text-lg font-semibold">Directus Assistant</h2>
        <button class="text-gray-400 hover:text-white" @click="emit('close')">✕</button>
      </header>

      <!-- Body/messages scrollable -->
      <div class="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
        <template v-for="(entry, idx) in chatHistoryStore.history" :key="idx">
          <div class="mb-2">
            <template v-if="entry.question !== ''">
              <div class="text-sm text-gray-400 mb-1">You :</div>
              <div class="mb-2 bg-gray-800 rounded-lg p-4">{{ entry.question }}</div>
            </template>
            <div class="text-sm text-gray-400 mb-1">Directus Assistant :</div>
            <ChatMessage
              :text="entry.answer"
              :error="entry.error ?? undefined"
              :sources="entry.sources"
              :isLast="idx === chatHistoryStore.history.length - 1"
            />
          </div>
        </template>
      </div>

      <!-- Input fixé en bas -->
      <div class="shrink-0 p-4 border-t border-grey">
        <ChatInput
          v-model="question"
          @submit="submit"
          placeholder="How to setup a M2M relationship ?"
        />
      </div>
    </div>
  </div>
</template>