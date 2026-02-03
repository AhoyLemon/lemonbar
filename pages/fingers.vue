<template lang="pug">
.fingers-page
  .container
      .header-section.mb-3
        div
          h2 🥃 Special Fingers
          p Select special occasion bottles to serve as "two fingers" - these won't be used in cocktails
      
      .info-card.mb-3
        p.info-text 
          | <strong>What are Fingers?</strong> Special occasion bottles that are too nice to mix in cocktails. 
          | They'll be served on their own - either straight up or on the rocks.
      
      .filters.mb-3
        button.filter-btn(:class="{ active: filter === 'all' }" @click="filter = 'all'") All ({{ bottles.length }})
        button.filter-btn(:class="{ active: filter === 'selected' }" @click="filter = 'selected'") Selected ({{ selectedBottles.length }})
        button.filter-btn(:class="{ active: filter === 'unselected' }" @click="filter = 'unselected'") Not Selected ({{ unselectedBottles.length }})
      
      .category-filters.mb-3
        button.category-btn(:class="{ active: categoryFilter === 'all' }" @click="categoryFilter = 'all'") All Categories
        button.category-btn(:class="{ active: categoryFilter === 'Special Occasion' }" @click="categoryFilter = 'Special Occasion'") Special Occasion
        button.category-btn(:class="{ active: categoryFilter === 'Staples' }" @click="categoryFilter = 'Staples'") Staples
        button.category-btn(:class="{ active: categoryFilter === 'Liqueur' }" @click="categoryFilter = 'Liqueur'") Liqueur
      
      .bottle-grid
        .bottle-card(
          v-for="bottle in filteredBottles" 
          :key="bottle.id"
          :class="{ 'selected': bottle.isFinger, 'out-of-stock': !bottle.inStock }"
          @click="toggleFingerStatus(bottle)"
        )
          .bottle-selected-indicator(v-if="bottle.isFinger") ✓
          .bottle-image(v-if="bottle.image")
            img(:src="bottle.image" :alt="bottle.name")
          .bottle-image.placeholder(v-else)
            span 🍾
          .bottle-info
            .bottle-name {{ bottle.name }}
            .bottle-category {{ bottle.category }}
            .bottle-status(:class="{ 'in-stock': bottle.inStock, 'out-of-stock': !bottle.inStock }")
              | {{ bottle.inStock ? 'In Stock' : 'Out of Stock' }}
</template>

<script setup lang="ts">
  import type { Bottle } from "~/types";

  const { loadInventory, inventory } = useCocktails();

  const filter = ref<"all" | "selected" | "unselected">("all");
  const categoryFilter = ref<string>("Special Occasion");

  // Load data on mount
  onMounted(async () => {
    await loadInventory();
  });

  // Get only in-stock bottles for selection
  const bottles = computed(() => inventory.value.filter((b) => b.inStock));

  const selectedBottles = computed(() => bottles.value.filter((b) => b.isFinger));
  const unselectedBottles = computed(() => bottles.value.filter((b) => !b.isFinger));

  const filteredBottles = computed(() => {
    let result = bottles.value;

    // Apply selection filter
    if (filter.value === "selected") {
      result = selectedBottles.value;
    } else if (filter.value === "unselected") {
      result = unselectedBottles.value;
    }

    // Apply category filter
    if (categoryFilter.value !== "all") {
      result = result.filter((b) => b.category === categoryFilter.value);
    }

    return result;
  });

  // Toggle finger status via API
  async function toggleFingerStatus(bottle: Bottle) {
    try {
      const updatedData = {
        ...bottle,
        isFinger: !bottle.isFinger,
      };

      await $fetch(`/api/inventory/${bottle.id}`, {
        method: "PUT",
        body: updatedData,
      });

      // Update local state
      const index = inventory.value.findIndex((b) => b.id === bottle.id);
      if (index !== -1) {
        inventory.value[index] = updatedData;
      }
    } catch (e) {
      console.error("Failed to update bottle finger status:", e);
      alert("Failed to update bottle. Please try again.");
    }
  }
</script>

<style lang="scss" scoped>
  @use "sass:color";
  @use "@/assets/styles/variables" as *;
  
  .fingers-page {
    min-height: 60vh;

    h2 {
      color: $dark-bg;
      margin-bottom: $spacing-sm;
    }

    p {
      color: color.adjust($text-dark, $lightness: 20%);
    }
  }

  .info-card {
    background: color.adjust($accent-color, $lightness: 45%);
    border: 2px solid $accent-color;
    border-radius: $border-radius-lg;
    padding: $spacing-lg;
    
    .info-text {
      margin: 0;
      color: $text-dark;
      line-height: 1.6;
    }
  }

  .filters,
  .category-filters {
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
  }

  .filter-btn,
  .category-btn {
    padding: $spacing-sm $spacing-lg;
    border-radius: $border-radius-md;
    background: white;
    border: 2px solid $border-color;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      border-color: $accent-color;
      background: color.adjust($accent-color, $lightness: 45%);
    }

    &.active {
      background: $accent-color;
      color: white;
      border-color: $accent-color;
    }
  }

  .category-btn {
    font-size: 0.875rem;
    padding: $spacing-xs $spacing-md;

    &.active {
      background: $primary-color;
      border-color: $primary-color;
    }
  }

  .bottle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-lg;
  }

  .bottle-card {
    background: white;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $shadow-sm;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    border: 3px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-lg;
    }

    &.selected {
      border-color: $accent-color;
      background: color.adjust($accent-color, $lightness: 48%);
    }

    &.out-of-stock {
      opacity: 0.6;
    }
  }

  .bottle-selected-indicator {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    width: 35px;
    height: 35px;
    background: $accent-color;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    z-index: 10;
    box-shadow: $shadow-md;
  }

  .bottle-image {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $light-bg;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    &.placeholder {
      font-size: 4rem;
      color: color.adjust($text-dark, $lightness: 40%);
    }
  }

  .bottle-info {
    padding: $spacing-md;
  }

  .bottle-name {
    font-weight: 600;
    font-size: 1rem;
    color: $dark-bg;
    margin-bottom: $spacing-xs;
  }

  .bottle-category {
    font-size: 0.875rem;
    color: color.adjust($text-dark, $lightness: 20%);
    margin-bottom: $spacing-xs;
  }

  .bottle-status {
    font-size: 0.75rem;
    font-weight: 600;
    
    &.in-stock {
      color: green;
    }

    &.out-of-stock {
      color: red;
    }
  }
</style>
