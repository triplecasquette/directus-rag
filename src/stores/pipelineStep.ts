import { defineStore } from 'pinia'

export const usePipelineStepStore = defineStore('pipelineStep', {
  state: () => ({
    step: 'idle' as 'idle' | 'checking' | 'sourcing' | 'optimizing' | 'reading' | 'thinking'
  }),
  actions: {
    setStep(newStep: 'idle' | 'checking' | 'sourcing' | 'optimizing' | 'reading' | 'thinking') {
      this.step = newStep
    }
  },
  getters: {
    isStep: (state) => (step: 'idle' | 'checking' | 'sourcing' | 'optimizing' | 'reading' | 'thinking') => state.step === step
  }
}) 