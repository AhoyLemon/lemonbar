export const useStarredDrinks = () => {
  const starredDrinkIds = useState<Set<string>>('starredDrinkIds', () => new Set())

  // Load starred drinks from localStorage on client side
  const loadStarredRecipes = () => {
    if (process.client) {
      const stored = localStorage.getItem('starredDrinks')
      if (stored) {
        try {
          const ids = JSON.parse(stored) as string[]
          starredDrinkIds.value = new Set(ids)
        } catch (e) {
          console.error('Failed to parse starred drinks:', e)
        }
      }
    }
  }

  // Save starred drinks to localStorage
  const saveStarredRecipes = () => {
    if (process.client) {
      const ids = Array.from(starredDrinkIds.value)
      localStorage.setItem('starredDrinks', JSON.stringify(ids))
    }
  }

  // Check if a recipe is starred
  const isStarred = (drinkId: string): boolean => {
    return starredDrinkIds.value.has(drinkId)
  }

  // Toggle star status for a recipe
  const toggleStar = (drinkId: string) => {
    if (starredDrinkIds.value.has(drinkId)) {
      starredDrinkIds.value.delete(drinkId)
    } else {
      starredDrinkIds.value.add(drinkId)
    }
    saveStarredRecipes()
  }

  // Get list of starred recipe IDs
  const getStarredIds = computed(() => Array.from(starredDrinkIds.value))

  return {
    loadStarredRecipes,
    isStarred,
    toggleStar,
    getStarredIds,
  }
}
