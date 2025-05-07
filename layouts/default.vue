<script setup lang="ts">
// ✅ Page metadata
useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
});
</script>

<template>
  <main class="min-h-screen">
      <slot />
    </main>
</template>
