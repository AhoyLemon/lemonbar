<template lang="pug" src="./index.pug"></template>

<script setup lang="ts">
  const tenant = useValidateTenant();

  const { loadBeerWine, getBeers, getWines, loading, error } = useBeerWine(tenant.value);

  onMounted(async () => {
    await loadBeerWine();
  });
</script>
