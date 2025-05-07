<template>
  <button
        type="button"
        class="px-4 py-2 bg-secondary hover:bg-primary text-white rounded disabled:opacity-50 font-beVietnam font-medium"
        :disabled="disabled"
        @click="clickEvent"
      >
        <slot/>
      </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled: boolean,
  clickEvent: () => void,
}>(),
{
  disabled: false,
});
</script>
