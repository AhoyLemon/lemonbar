/**
 * Tenant Configuration
 *
 * Maps each tenant to their Cockpit CMS collection/singleton names and bar name.
 * This enables multi-tenant support with path-based routing.
 */

export interface TenantConfig {
  slug: string;
  barName: string;
  barData: string; // Cockpit singleton name (e.g., "sampleBar", "barLemon")
  description?: string;
  ogImage?: string;
  includeCommonDrinks: boolean; // Include common cocktails from Cockpit API
  includeRandomCocktails: boolean; // Include random cocktails from TheCocktailDB
}

export const TENANT_CONFIG: Record<string, TenantConfig> = {
  default: {
    slug: "foo",
    barName: "Sample Bar",
    barData: "sampleBar",
    description: "Explore our sample bar inventory - spirits, cocktails, beer, and wine. Check what's available now!",
    includeCommonDrinks: false,
    includeRandomCocktails: false,
  },
  lemon: {
    slug: "lemon",
    barName: "Lemonhaus",
    barData: "lemonBar",
    description: "See the drinks you can order if you go to lemon's bar.",
    ogImage: "/opengraph-lemon.png",
    includeCommonDrinks: true,
    includeRandomCocktails: false,
  },
  victor: {
    slug: "victor",
    barName: "Victor's Place",
    barData: "barVictor",
    description: "Victor's Place - Your destination for premium spirits, expertly crafted cocktails, and fine wine selection. Check availability now!",
    includeCommonDrinks: true,
    includeRandomCocktails: true,
  },
  // Alias for default - foo tenant uses same config as default
  foo: {
    slug: "foo",
    barName: "Sample Bar",
    barData: "sampleBar",
    description: "Explore our sample bar inventory - spirits, cocktails, beer, and wine. Check what's available now!",
    includeCommonDrinks: false,
    includeRandomCocktails: false,
  },
};

/**
 * Get tenant configuration by slug
 * @param slug - The tenant slug (e.g., "lemon", "victor")
 * @returns The tenant configuration or null if not found
 */
export function getTenantConfig(slug: string): TenantConfig | null {
  return TENANT_CONFIG[slug] || null;
}

/**
 * Get default tenant configuration
 * @returns The default tenant configuration
 */
export function getDefaultTenantConfig(): TenantConfig {
  return TENANT_CONFIG.default;
}

/**
 * Get list of all valid tenant slugs
 * @returns Array of tenant slugs (excluding 'default')
 */
export function getAllTenantSlugs(): string[] {
  return Object.keys(TENANT_CONFIG).filter((slug) => slug !== "default");
}

/**
 * Check if a tenant slug is valid
 * @param slug - The tenant slug to check
 * @returns True if the slug is valid, false otherwise
 */
export function isValidTenant(slug: string): boolean {
  return slug in TENANT_CONFIG && slug !== "default";
}
