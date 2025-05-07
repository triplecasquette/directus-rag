<script setup lang="ts">
import { usePipelineStepStore } from '~/src/stores/pipelineStep';

  const stepStore = usePipelineStepStore()
  const step = computed(() => stepStore.step)
</script>

<template>
  <div class="loader">
    <span v-if="step === 'checking'">Checking if your question is about Directus</span>
    <span v-else-if="step === 'sourcing'">Sourcing documentation</span>
    <span v-else-if="step === 'optimizing'">Optimizing context</span>
    <span v-else-if="step === 'reading'">Reading documentation</span>
    <span v-else>Thinking</span>
    <span class="dots"/>
  </div>
</template>


<style>
.loader {
  font-family: sans-serif;
  font-size: 1.2rem;
  color: #444;
  display: inline-block;
}

.dots::after {
  content: '';
  animation: dots 1.2s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }

  25% {
    content: '.';
  }

  50% {
    content: '..';
  }

  75% {
    content: '...';
  }

  100% {
    content: '';
  }
}
</style>
