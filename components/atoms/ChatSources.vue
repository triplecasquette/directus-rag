<script setup lang="ts">
  defineProps<{
    sources: {
      text: string
      source: string
      section?: string
    }[]
  }>()
</script>

<template>
  <div class="mt-4 text-sm text-gray-400 space-y-1">
    <p class="text-xs uppercase tracking-wide text-gray-500">Sources :</p>
    <ul class="space-y-0.5">
      <li
        v-for="(src, i) in sources"
        :key="i"
        class="flex items-center gap-2"
      >
        <span class="text-violet-400">•</span>
        <NuxtLink to="#" class="hover:underline flex items-center gap-1">
          <span class="font-mono">{{ src.source }}</span>
          <span v-if="src.section"> — {{ src.section }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
