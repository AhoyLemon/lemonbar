<template lang="pug">
.essentials-page
  .container
      h2 📋 Essential Ingredients
      p.mb-3 Build your home bar with these key ingredients to unlock the most cocktails

      .stats.mb-3
        .stat-card
          h3 {{ potentialRecipes }}
          p Recipes You Could Make

        .stat-card
          h3 {{ currentCoverage }}%
          p Current Coverage

        .stat-card
          h3 {{ missingEssentials.length }}
          p Missing Essentials

      .essentials-section.mb-3(v-if="missingEssentials.length > 0")
        h3 🎯 Top Missing Ingredients
        p.subtitle Add these to unlock the most recipes

        .essentials-grid
          .essential-card(
            v-for="essential in missingEssentials.slice(0, 10)"
            :key="essential.name"
          )
            .essential-card__header
              h4 {{ essential.name }}
              .impact-badge +{{ essential.recipeCount }} recipe{{ essential.recipeCount !== 1 ? 's' : '' }}
            
            .essential-card__body
              p.frequency Appears in {{ essential.totalOccurrences }} recipe{{ essential.totalOccurrences !== 1 ? 's' : '' }}
              
              .example-recipes(v-if="essential.exampleRecipes.length > 0")
                p.small Needed for:
                ul.recipe-list
                  li(v-for="recipe in essential.exampleRecipes.slice(0, 3)" :key="recipe")
                    | {{ recipe }}
                  li.more(v-if="essential.recipeCount > 3")
                    | +{{ essential.recipeCount - 3 }} more

      .essentials-section.mb-3(v-if="haveEssentials.length > 0")
        h3 ✅ Essentials You Have
        p.subtitle You're well-stocked with these core ingredients

        .essentials-grid.have-grid
          .essential-card.have(
            v-for="essential in haveEssentials.slice(0, 6)"
            :key="essential.name"
          )
            .essential-card__header
              h4 {{ essential.name }}
              .check-badge ✓
            
            .essential-card__body
              p.frequency Used in {{ essential.totalOccurrences }} recipe{{ essential.totalOccurrences !== 1 ? 's' : '' }}

      .empty-state(v-if="missingEssentials.length === 0")
        .empty-state__icon 🎉
        h3 You Have All the Essentials!
        p Your bar is well-stocked with the core ingredients
        NuxtLink.btn.btn-primary(to="/recipes") Explore Recipes
</template>

<script setup lang="ts">
import type { Recipe } from '~/types'

const {
  loadInventory,
  loadLocalRecipes,
  fetchRandomCocktails,
  getAllRecipes,
  isIngredientInStock,
} = useCocktails()

// Load data on mount
onMounted(async () => {
  await loadInventory()
  await loadLocalRecipes()
  await fetchRandomCocktails(8)
})

interface EssentialIngredient {
  name: string
  totalOccurrences: number
  recipeCount: number
  exampleRecipes: string[]
  inStock: boolean
}

// Define core essential ingredient categories
const essentialCategories = [
  // Core spirits
  'vodka',
  'gin',
  'rum',
  'tequila',
  'whiskey',
  'bourbon',
  // Essential liqueurs
  'triple sec',
  'cointreau',
  'orange liqueur',
  'vermouth',
  // Citrus
  'lime',
  'lemon',
  'lime juice',
  'lemon juice',
  // Sweeteners
  'simple syrup',
  'sugar',
  'syrup',
  // Carbonated
  'club soda',
  'soda water',
  'tonic water',
  'ginger beer',
  // Bitters and garnish
  'bitters',
  'angostura',
  'grenadine',
  // Common mixers
  'orange juice',
  'cranberry juice',
  'pineapple juice',
]

// Compute essential ingredients statistics
const essentialIngredients = computed(() => {
  const recipes = getAllRecipes.value
  const ingredientMap = new Map<string, EssentialIngredient>()

  // Count ingredient occurrences across all recipes
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const name = ingredient.name.toLowerCase().trim()

      // Check if this is an essential ingredient
      const isEssential = essentialCategories.some(
        category => name.includes(category) || category.includes(name)
      )

      if (!isEssential) continue

      if (!ingredientMap.has(name)) {
        ingredientMap.set(name, {
          name: ingredient.name,
          totalOccurrences: 0,
          recipeCount: 0,
          exampleRecipes: [],
          inStock: isIngredientInStock(ingredient.name),
        })
      }

      const entry = ingredientMap.get(name)!
      entry.totalOccurrences++
      entry.recipeCount++

      if (entry.exampleRecipes.length < 5 && !entry.exampleRecipes.includes(recipe.name)) {
        entry.exampleRecipes.push(recipe.name)
      }
    }
  }

  return Array.from(ingredientMap.values())
})

// Split into missing and have
const missingEssentials = computed(() => {
  return essentialIngredients.value
    .filter(e => !e.inStock)
    .sort((a, b) => b.recipeCount - a.recipeCount)
})

const haveEssentials = computed(() => {
  return essentialIngredients.value
    .filter(e => e.inStock)
    .sort((a, b) => b.recipeCount - a.recipeCount)
})

// Calculate potential recipes if missing essentials were added
const potentialRecipes = computed(() => {
  const allRecipes = getAllRecipes.value

  // Count recipes that would become available if we had all essentials
  let count = 0
  for (const recipe of allRecipes) {
    const missingIngredients = recipe.ingredients.filter(ing => !isIngredientInStock(ing.name))

    // If all missing ingredients are in our essentials list, this recipe would be available
    if (
      missingIngredients.length > 0 &&
      missingIngredients.every(ing =>
        essentialCategories.some(
          cat => ing.name.toLowerCase().includes(cat) || cat.includes(ing.name.toLowerCase())
        )
      )
    ) {
      count++
    }
  }

  return count
})

// Calculate current coverage
const currentCoverage = computed(() => {
  const total = essentialIngredients.value.length
  const have = haveEssentials.value.length

  if (total === 0) return 0
  return Math.round((have / total) * 100)
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;

.essentials-page {
  min-height: 60vh;

  h2 {
    color: $dark-bg;
    margin-bottom: $spacing-sm;
  }

  p {
    color: color.adjust($text-dark, $lightness: 20%);
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
}

.stat-card {
  background: linear-gradient(
    135deg,
    $accent-color 0%,
    color.adjust($accent-color, $lightness: -10%) 100%
  );
  color: white;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  text-align: center;
  box-shadow: $shadow-md;

  h3 {
    font-size: 2.5rem;
    margin: 0 0 $spacing-xs 0;
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
    color: white;
  }
}

.essentials-section {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;

  h3 {
    color: $dark-bg;
    margin: 0 0 $spacing-xs 0;
  }

  .subtitle {
    margin: 0 0 $spacing-lg 0;
    color: color.adjust($text-dark, $lightness: 30%);
  }
}

.essentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;

  &.have-grid {
    opacity: 0.8;
  }
}

.essential-card {
  background: color.adjust($accent-color, $lightness: 48%);
  border: 2px solid color.adjust($accent-color, $lightness: 40%);
  border-radius: $border-radius-md;
  padding: $spacing-lg;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $accent-color;
  }

  &.have {
    background: color.adjust($primary-color, $lightness: 50%);
    border-color: color.adjust($primary-color, $lightness: 40%);

    &:hover {
      border-color: $primary-color;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;

    h4 {
      margin: 0;
      color: $dark-bg;
      font-size: 1.125rem;
      flex: 1;
    }
  }

  &__body {
    .frequency {
      margin: 0 0 $spacing-md 0;
      font-size: 0.875rem;
      color: color.adjust($text-dark, $lightness: 20%);
      font-weight: 600;
    }

    .small {
      margin: 0 0 $spacing-xs 0;
      font-size: 0.8rem;
      color: color.adjust($text-dark, $lightness: 25%);
      font-weight: 600;
    }
  }
}

.impact-badge {
  background: $accent-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  margin-left: $spacing-sm;
}

.check-badge {
  background: $primary-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 700;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: $spacing-sm;
}

.example-recipes {
  .recipe-list {
    margin: 0;
    padding-left: $spacing-lg;
    font-size: 0.875rem;

    li {
      color: color.adjust($text-dark, $lightness: 15%);
      margin-bottom: $spacing-xs;

      &.more {
        color: color.adjust($text-dark, $lightness: 30%);
        font-style: italic;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-xxl;
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;

  &__icon {
    font-size: 4rem;
    margin-bottom: $spacing-lg;
  }

  h3 {
    color: $dark-bg;
    margin-bottom: $spacing-md;
  }

  p {
    color: color.adjust($text-dark, $lightness: 20%);
    margin-bottom: $spacing-lg;
  }
}

.btn {
  display: inline-block;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-md;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &-primary {
    background: $accent-color;
    color: white;

    &:hover {
      background: color.adjust($accent-color, $lightness: -10%);
    }
  }
}
</style>
