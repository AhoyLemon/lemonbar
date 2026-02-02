// Composable for managing essential ingredients checklist
export const useEssentials = () => {
  const checkedEssentials = useState<string[]>('checkedEssentials', () => {
    // Try to load from localStorage if on client
    if (process.client) {
      const saved = localStorage.getItem('checkedEssentials')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // List of essential ingredients categorized
  const essentialCategories = [
    {
      name: 'Citrus & Fruit',
      icon: '🍋',
      items: [
        'Fresh Lime',
        'Fresh Lemon',
        'Lime Juice',
        'Lemon Juice',
        'Orange Juice',
        'Grapefruit Juice',
        'Pineapple Juice',
        'Cranberry Juice',
        'Orange',
        'Lime Wedges',
        'Lemon Wedges',
      ],
    },
    {
      name: 'Sweeteners',
      icon: '🍯',
      items: ['Simple Syrup', 'Sugar', 'Honey', 'Agave Nectar', 'Grenadine', 'Maple Syrup'],
    },
    {
      name: 'Carbonated & Mixers',
      icon: '🥤',
      items: [
        'Club Soda',
        'Soda Water',
        'Tonic Water',
        'Ginger Beer',
        'Ginger Ale',
        'Sparkling Water',
        'Cola',
        'Sprite/7-Up',
      ],
    },
    {
      name: 'Bitters & Aromatics',
      icon: '🌿',
      items: [
        'Angostura Bitters',
        'Orange Bitters',
        "Peychaud's Bitters",
        'Aromatic Bitters',
        'Mint Leaves',
        'Basil',
      ],
    },
    {
      name: 'Dairy & Cream',
      icon: '🥛',
      items: ['Heavy Cream', 'Milk', 'Half and Half', 'Coconut Cream', 'Egg Whites'],
    },
    {
      name: 'Basics',
      icon: '🧊',
      items: ['Ice', 'Water', 'Salt', 'Black Pepper', 'Hot Sauce', 'Worcestershire Sauce'],
    },
    {
      name: 'Garnishes',
      icon: '🍒',
      items: [
        'Maraschino Cherries',
        'Olives',
        'Cocktail Onions',
        'Celery',
        'Cucumber',
        'Pineapple Wedges',
      ],
    },
  ]

  const toggleEssential = (item: string) => {
    const index = checkedEssentials.value.indexOf(item)
    if (index > -1) {
      checkedEssentials.value.splice(index, 1)
    } else {
      checkedEssentials.value.push(item)
    }

    // Save to localStorage
    if (process.client) {
      localStorage.setItem('checkedEssentials', JSON.stringify(checkedEssentials.value))
    }
  }

  const isChecked = (item: string) => {
    return checkedEssentials.value.includes(item)
  }

  const clearAll = () => {
    checkedEssentials.value = []
    if (process.client) {
      localStorage.removeItem('checkedEssentials')
    }
  }

  const checkAll = () => {
    const allItems = essentialCategories.flatMap(cat => cat.items)
    checkedEssentials.value = [...allItems]
    if (process.client) {
      localStorage.setItem('checkedEssentials', JSON.stringify(checkedEssentials.value))
    }
  }

  const totalEssentials = computed(() => {
    return essentialCategories.reduce((sum, cat) => sum + cat.items.length, 0)
  })

  const checkedCount = computed(() => checkedEssentials.value.length)

  const completionPercentage = computed(() => {
    if (totalEssentials.value === 0) return 0
    return Math.round((checkedCount.value / totalEssentials.value) * 100)
  })

  return {
    essentialCategories,
    checkedEssentials,
    toggleEssential,
    isChecked,
    clearAll,
    checkAll,
    totalEssentials,
    checkedCount,
    completionPercentage,
  }
}
