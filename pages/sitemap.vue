<script setup lang="ts">
// Redirect /sitemap to /sitemap.xml
navigateTo("/sitemap.xml", { redirectCode: 301, external: false });
</script>

<template>
  <div>Redirecting to sitemap...</div>
</template>
