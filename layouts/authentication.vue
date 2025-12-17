<script setup lang="ts">
</script>

<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #1E90FF 50%, #00008B 100%);
}
</style>