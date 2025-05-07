<script setup lang="ts">
import ChatWidget from '~/components/organisms/ChatWidget.vue';

</script>

<template>
  <section class="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-poppins font-bold mb-2">🐇 Directus RAG Assistant</h1>
    <p class="text-gray-400 mb-6 font-lexend text-center max-w-md">
      Ask your questions about the Directus documentation using the assistant widget in the bottom-right corner.
    </p>

    <ChatWidget />
  </section>
</template>
