/**
 * Tenant Configuration
 * 
 * Maps each tenant to their Cockpit CMS collection/singleton names and bar name.
 * This enables multi-tenant support with path-based routing.
 */

export interface TenantConfig {
  slug: string;
  barName: string;
  bottles: string;
  drinks: string;
  essentials: string;
  beerWine: string;
}

export const TENANT_CONFIG: Record<string, TenantConfig> = {
  default: {
    slug: "foo",
    barName: "Sample Bar",
    bottles: "bottlesSample",
    drinks: "drinksFoo",
    essentials: "essentialsFoo",
    beerWine: "beerWineSample",
  },
  lemon: {
    slug: "lemon",
    barName: "Willkommen am Lemonhaus",
    bottles: "bottles",
    drinks: "drinks",
    essentials: "essentials",
    beerWine: "beerWine",
  },
  victor: {
    slug: "victor",
    barName: "Victor's Place",
    bottles: "bottlesVictor",
    drinks: "drinksVictor",
    essentials: "essentialsVictor",
    beerWine: "beerWineVictor",
  },
  // Alias for default - foo tenant uses same config as default
  foo: {
    slug: "foo",
    barName: "Sample Bar",
    bottles: "bottlesSample",
    drinks: "drinksFoo",
    essentials: "essentialsFoo",
    beerWine: "beerWineSample",
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
  return Object.keys(TENANT_CONFIG).filter(slug => slug !== 'default');
}

/**
 * Check if a tenant slug is valid
 * @param slug - The tenant slug to check
 * @returns True if the slug is valid, false otherwise
 */
export function isValidTenant(slug: string): boolean {
  return slug in TENANT_CONFIG && slug !== 'default';
}
