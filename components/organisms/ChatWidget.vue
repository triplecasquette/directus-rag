<script setup lang="ts">
import Button from '../atoms/Button.vue'
import ChatWindow from './ChatWindow.vue'

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }
</script>

<template>
  <!-- Bouton flottant -->
  <Button
    :click-event="toggle"
    class="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition"
    aria-label="Open assistant"
    :disabled="false"
  >
    🐇
  </Button>

  <!-- Fenêtre modale -->
  <ChatWindow v-if="isOpen" @close="toggle" />
</template>
