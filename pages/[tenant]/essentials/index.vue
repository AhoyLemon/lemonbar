<template lang="pug" src="./index.pug"></template>
<style lang="scss" scoped src="./index.scss"></style>

<script setup lang="ts">
  import { getTenantConfig, getDefaultTenantConfig } from "~/utils/tenants";
  import type { Bitter } from "~/types";

  const tenant = useValidateTenant();

  const { essentials, essentialCategories, loading, error, fetchEssentials, getItemsForCategory, totalEssentials } =
    useEssentials(tenant.value);

  // Fetch bitters separately since they're now separate from essentials
  const bitters = ref<Bitter[]>([]);
  const fetchBitters = async () => {
    try {
      const cockpitAPI = useCockpitAPI(tenant.value);
      const barData = await cockpitAPI.fetchBarData();
      bitters.value = barData.bitters;
    } catch (e) {
      console.error("Failed to fetch bitters:", e);
      bitters.value = [];
    }
  };

  // Collect unique flavors from all bitters bottles
  const bittersFlavors = computed(() => {
    if (!bitters.value) return [];
    const flavors = bitters.value.flatMap((b: any) => b.flavors || []);
    return Array.from(new Set(flavors));
  });

  // Fetch essentials and bitters - runs on every navigation to this page
  await Promise.all([fetchEssentials(), fetchBitters()]);

  const getCategoryItemCount = (category: { name: string }) => {
    return getItemsForCategory(category.name).length;
  };
</script>
