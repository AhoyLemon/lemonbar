export const useStarredRecipes = () => {
  const starredRecipeIds = useState<Set<string>>('starredRecipeIds', () => new Set())

  // Load starred recipes from localStorage on client side
  const loadStarredRecipes = () => {
    if (process.client) {
      const stored = localStorage.getItem('starredRecipes')
      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[]
          starredRecipeIds.value = new Set(ids)
        } catch (e) {
          console.error('Failed to parse starred recipes:', e)
        }
      }
    }
  }

  // Save starred recipes to localStorage
  const saveStarredRecipes = () => {
    if (process.client) {
      const ids = Array.from(starredRecipeIds.value)
      localStorage.setItem('starredRecipes', JSON.stringify(ids))
    }
  }

  // Check if a recipe is starred
  const isStarred = (recipeId: string): boolean => {
    return starredRecipeIds.value.has(recipeId)
  }

  // Toggle star status for a recipe
  const toggleStar = (recipeId: string) => {
    if (starredRecipeIds.value.has(recipeId)) {
      starredRecipeIds.value.delete(recipeId)
    } else {
      starredRecipeIds.value.add(recipeId)
    }
    saveStarredRecipes()
  }

  // Get list of starred recipe IDs
  const getStarredIds = computed(() => Array.from(starredRecipeIds.value))

  return {
    loadStarredRecipes,
    isStarred,
    toggleStar,
    getStarredIds,
  }
}
