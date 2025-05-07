<script setup lang="ts">
import PaperPlane from '../svg/PaperPlane.vue';
import Button from './Button.vue';
import { usePipelineStepStore } from '~/src/stores/pipelineStep';

const pipelineStepStore = usePipelineStepStore()
const step = computed(() => pipelineStepStore.step)

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(),{
  placeholder: 'Ask something...',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const onEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('submit')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="relative flex items-center gap-2 font-beVietnam">
      <textarea
        :value="modelValue"
        :disabled="step !== 'idle'"
        @input="onInput"
        @keydown="onEnter"
        :placeholder="placeholder || 'Ask something...'"
        class="w-full p-3 h-12 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg resize-none"
        rows="3"
      />
      <Button
        color="accent-shiny"
        :disabled="step !== 'idle'"
        :click-event="() => emit('submit')"
        class="absolute right-2 bottom-2 h-8 rounded-lg transition disabled:opacity-50"
      >
        <PaperPlane :size="1.2" />
      </Button>
    </div>
  </div>
</template>
