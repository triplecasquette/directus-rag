import { ref } from 'vue'
import type { RagResponse } from '~/src/types/rag'
import { usePipelineStepStore } from '~/src/stores/pipelineStep'


export const useRagChat = () => {
  const pipelineStepStore = usePipelineStepStore()
  const error = ref<null | string>(null)
  const answer = ref<string | null>(null)
  const sources = ref<
    { source: string; section?: string; text: string }[]
  >([])

  const ask = async (question: string) => {
    error.value = null
    answer.value = null
    sources.value = []

    try {
      const data = await $fetch<RagResponse>('/api/rag/ask', {
        method: 'POST',
        body: { question }
      })

      pipelineStepStore.setStep('thinking')

      answer.value = data?.answer ?? null
      sources.value = (data?.sources ?? []).map(src => ({
        text: src.payload?.text ?? '',
        source: src.payload?.source ?? '',
        section: src.payload?.section,
        lang: src.payload?.lang ?? '',
        tokens: src.payload?.tokens ?? 0,
        score: src.score ?? 0
      }))

      console.log(sources.value);
    } catch (err: any) {
      error.value = err.message || 'Unknown error'
    } finally {
      pipelineStepStore.setStep('idle')
    }
  }

  return {
    error,
    answer,
    sources,
    ask
  }
}
