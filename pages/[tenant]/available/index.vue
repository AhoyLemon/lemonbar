<template lang="pug" src="./index.pug"></template>

<script setup lang="ts">
  import type { Bottle } from "~/types";

  const tenant = useValidateTenant();

  const { loadInventory, inventory, loadLocalDrinks, loadEssentials, getAvailableDrinks, error } = useCocktails(
    tenant.value,
  );
  const { loadStarredDrinks } = useStarredDrinks();
  const { loadBeerWine, getInStockBeerWine } = useBeerWine(tenant.value);

  // Filter state
  const filter = ref<"all" | "fingers" | "beerWine" | "cocktails">("all");

  // Load data on mount
  onMounted(async () => {
    await loadInventory();
    await loadEssentials();
    await loadLocalDrinks();
    loadStarredDrinks();
    await loadBeerWine();
  });

  // Get available finger bottles
  const availableFingerBottles = computed(() => {
    return inventory.value.filter((b) => b.inStock && b.isFingers);
  });

  // All count for 'All' button
  const allCount = computed(() => {
    return getAvailableDrinks.value.length + availableFingerBottles.value.length + getInStockBeerWine.value.length;
  });
</script>
