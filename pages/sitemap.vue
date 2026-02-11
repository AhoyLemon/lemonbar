<script setup lang="ts">
// Redirect /sitemap to /sitemap.xml with permanent redirect
await navigateTo("/sitemap.xml", { redirectCode: 301 });
</script>
