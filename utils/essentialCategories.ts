// Essential categories mapping
// Maps category names to objects containing items array and icon
// Items not found in any category will be placed in "Other"

export interface CategoryConfig {
  items: string[];
  icon: string;
}

export const ESSENTIAL_CATEGORIES: Record<string, CategoryConfig> = {
  Basics: {
    icon: "🧊",
    items: ["ice", "water", "salt", "black pepper"],
  },
  "Carbonated & Mixers": {
    icon: "🥤",
    items: ["club soda", "tonic water", "ginger ale", "ginger beer", "sparkling water", "cola", "orange soda"],
  },
  "Fruits & Berries": {
    icon: "🍓",
    items: ["Lemons", "Limes", "Grapefruits", "Oranges", "Cherries", "Blackberries", "Blueberries", "Raspberries", "Strawberries", "Cranberries"],
  },
  Sweeteners: {
    icon: "🍯",
    items: ["agave nectar", "grenadine", "honey", "maple syrup", "sugar", "simple syrup", "brown sugar", "coconut sugar"],
  },
  "Dairy & Cream": {
    icon: "🥛",
    items: ["eggs", "milk", "half and half", "half & half", "heavy cream", "coconut cream"],
  },
  " Juices": {
    icon: "🍹",
    items: ["lemon juice", "lime juice", "orange juice", "grapefruit juice", "pineapple juice", "cranberry juice", "tomato juice"],
  },
  Other: {
    icon: "📦",
    items: [
      // Items that don't fit other categories will be placed here automatically
    ],
  },
};

// Helper function to categorize an essential item
export const categorizeEssential = (name: string): string => {
  const normalizedName = name.toLowerCase().trim();

  for (const [category, config] of Object.entries(ESSENTIAL_CATEGORIES)) {
    if (config.items.some((item) => item.toLowerCase().trim() === normalizedName)) {
      return category;
    }
  }

  return "Other";
};

// Generate category configuration array for the UI
export const getEssentialCategories = () => {
  return Object.entries(ESSENTIAL_CATEGORIES).map(([name, config]) => ({
    name,
    icon: config.icon,
    key: name
      .toLowerCase()
      .replace(/\s+&\s+/g, "")
      .replace(/\s+/g, ""),
  }));
};
