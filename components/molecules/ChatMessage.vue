<script setup lang="ts">
import { parseMarkdown } from '~/src/utils/parseMarkdown';
import ChatSources from '../atoms/ChatSources.vue'
import ThinkingLoader from '../atoms/ThinkingLoader.vue';
import { usePipelineStepStore } from '~/src/stores/pipelineStep';

const pipelineStepStore = usePipelineStepStore()
const step = computed(() => pipelineStepStore.step)

const props = defineProps<{
  text?: string
  error?: string
  sources?: {
    text: string
    source: string
    section?: string
  }[]
  isLast?: boolean
}>()


const md = computed(() => props.text ? parseMarkdown(props.text) : '')

</script>

<template>
  <div class="bg-gray-800 text-white p-4 rounded-lg shadow space-y-3">
    <!-- Loading Steps -->
    <ThinkingLoader v-if="isLast && step !== 'idle'" />

    <!-- Error -->
    <p v-else-if="error" class="text-sm text-red-400">{{ error }}</p>

    <!-- Answer -->
    <article v-else-if="text" class="prose prose-invert max-w-none [&>pre]:my-2 text-sm font-beVietnam leading-relaxed"
      v-html="md" />

    <!-- Sources -->
    <ChatSources v-if="sources?.length" :sources="sources" />
  </div>
</template>
