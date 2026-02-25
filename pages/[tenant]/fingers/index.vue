<template lang="pug" src="./index.pug"></template>

<script setup lang="ts">
  const tenant = useValidateTenant();

  const { loadInventory, inventory, error } = useCocktails(tenant.value);

  const filter = ref<"all" | "selected" | "unselected">("selected");
  const categoryFilter = ref<string>("all");

  // Load data on mount
  onMounted(async () => {
    await loadInventory();
  });

  const bottles = computed(() => inventory.value || []);
  const fingerBottles = computed(() => bottles.value.filter((b) => b.isFingers));
  const nonFingerBottles = computed(() => bottles.value.filter((b) => !b.isFingers));

  const filteredBottles = computed(() => {
    let result = bottles.value;

    // Apply finger filter
    if (filter.value === "selected") {
      result = fingerBottles.value;
    } else if (filter.value === "unselected") {
      result = nonFingerBottles.value;
    }

    // Apply category filter
    if (categoryFilter.value !== "all") {
      result = result.filter((b) => b.category === categoryFilter.value);
    }

    return result;
  });
</script>
