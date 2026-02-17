[![kinda.fun](/_NFW/repo-opengraph.png)](https://booz.bar)

[![Last Deploy](https://img.shields.io/github/last-commit/AhoyLemon/booz?label=Last%20Deploy&style=for-the-badge&color=green&logo=github&logoColor=white)](https://github.com/AhoyLemon/booz/actions)
[![Live Site](https://img.shields.io/badge/Live%20Site-booz.bar-blue?style=for-the-badge&logo=globe&logoColor=white)](https://booz.bar)

[![Open Issues](https://img.shields.io/github/issues/AhoyLemon/booz?label=Issues&style=for-the-badge&color=orange)](https://github.com/AhoyLemon/booz/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/AhoyLemon/booz?label=&style=for-the-badge&color=222)](https://github.com/AhoyLemon/booz/issues?q=is%3Aissue+is%3Aclosed)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![Open PRs](https://img.shields.io/github/issues-pr/AhoyLemon/booz?label=Pull%20Requests&style=for-the-badge&color=orange)](https://github.com/AhoyLemon/booz/pulls)
[![Closed PRs](https://img.shields.io/github/issues-pr-closed/AhoyLemon/booz?label=&style=for-the-badge&color=222)](https://github.com/AhoyLemon/booz/pulls?q=is%3Apr+is%3Aclosed)
[![Commit Activity](https://img.shields.io/github/commit-activity/w/AhoyLemon/booz?style=for-the-badge&label=Commit%20Activity&color=blue&logo=git&logoColor=white)](https://github.com/AhoyLemon/booz/graphs/commit-activity)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-white?style=for-the-badge&logo=creativecommons&logoColor=white)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-Available-4FC08D?style=for-the-badge&logo=readthedocs&logoColor=white)](docs/)

A multi-tenant bar inventory and cocktail app built with Nuxt 3, supporting multiple bars with tenant-specific data from Cockpit CMS.

## Features

- **Inventory Management**: Track bottles with size, state, and images per tenant
- **Recipe Discovery**: Find cocktails from your custom cocktails or The Cocktail DB
- **Smart Matching**: See which drinks you can make with your current inventory
- **Non-Alcoholic Support**: Includes mocktails, beer, and wine
- **Live Data**: Fetches fresh data directly from Cockpit CMS API
- **Multi-Tenant Support**: Host multiple bars with separate inventories and drinks using path-based routing

## Made with

[![Vite](https://img.shields.io/badge/Nuxt-000?style=for-the-badge&labelColor=00DC82&logo=nuxt&logoColor=white&color=222)](https://nuxt.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-000?style=for-the-badge&labelColor=4FC08D&logo=vue.js&logoColor=white&color=222)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-000?style=for-the-badge&labelColor=3178C6&logo=typescript&logoColor=white&color=222)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000?style=for-the-badge&labelColor=000000&logo=bun&logoColor=white&color=222)](https://bun.sh)
[![Sass](https://img.shields.io/badge/Sass-000?style=for-the-badge&labelColor=CC6699&logo=sass&logoColor=white&color=222)](https://sass-lang.com/)
[![Pug](https://img.shields.io/badge/Pug-000?style=for-the-badge&labelColor=A86454&logo=pug&logoColor=white&color=222)](https://pugjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-000?style=for-the-badge&labelColor=6E9F18&logo=vitest&logoColor=white&color=222)](https://vitest.dev)
[![Prettier](https://img.shields.io/badge/Prettier-000?style=for-the-badge&labelColor=F7B93E&logo=prettier&logoColor=111&color=222)](https://prettier.io)
[![Cockpit](https://img.shields.io/badge/Cockpit-000?style=for-the-badge&labelColor=0066CC&logo=cockpit&logoColor=fff&color=222)](https://getcockpit.com)
[![JSON](https://img.shields.io/badge/JSON-000?style=for-the-badge&labelColor=000000&logo=json&logoColor=fff&color=222)](https://www.json.org/json-en.html)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-000?style=for-the-badge&labelColor=000000&logo=github&logoColor=fff&color=222)](http://pages.github.com/)

#### Multi-Tenant URLs

Once deployed, your tenants will be accessible at:

- `https://booz.bar/` (Home Page)
- `https://booz.bar/about` - About Page
- `https://booz.bar/foo` - Home page for a tenant named "foo"
- `https://booz.bar/foo/available` - Available drinks for "foo" (follow similar structure for drinks, bottles, essentials, et al)

#### How It Works

The deployed site fetches data directly from your Cockpit CMS API at runtime. This means:

- Visitors see fresh, up-to-date inventory and drink data
- No need to rebuild/redeploy when data changes in Cockpit CMS
- Updates to your CMS are immediately reflected on the live site
- Each tenant fetches from their configured Cockpit collections

## Data Structure

All TypeScript interfaces and types are defined in [`types/index.ts`](./types/index.ts). This file contains comprehensive type definitions for:

- **Tenant Configuration** - Multi-tenant setup and routing
- **Bar Data** - Complete bar inventory structure
- **Bottles** - Spirit inventory with detailed metadata
- **Drinks** - Cocktail recipes with ingredients and instructions
- **Beer/Wine** - Non-spirit bottle inventory
- **Bitters** - Cocktail bitters and flavor profiles
- **Essentials** - Bar essentials and mixers
- **Search Types** - Omnisearch and drink search interfaces

The root data structure for each tenant is a `BarData` object containing arrays of bottles, drinks, beers, wines, bitters, and essentials.

For detailed field descriptions and comments, see the type definitions in [`types/index.ts`](./types/index.ts).

## Architecture

### Multi-Tenant Routing

The app uses Nuxt's dynamic routing with a `[tenant]` parameter:

- All pages are under `/pages/[tenant]/`
- Middleware (`middleware/tenant.global.ts`) handles:
  - Non-tenant routes (home, about)
  - Redirecting root paths to default tenant
  - Validating tenant slugs
  - Showing error pages for unknown tenants

### Data Fetching

All composables accept an optional tenant parameter:

```typescript
const { fetchBottles, fetchDrinks } = useCockpitAPI(tenantSlug);
const { loadInventory } = useCocktails(tenantSlug);
const { loadBeerWine } = useBeerWine(tenantSlug);
```

### State Management

Each tenant has isolated state using tenant-prefixed keys:

```typescript
const inventory = useState(`${tenantSlug}_inventory`, () => []);
```

## Testing

```bash
# With Bun
bun test

# Or with npm
npm test
```

## Code Formatting

```bash
# With Bun
bun run format

# Or with npm
npm run format
```

## Further Documentation

- The [docs](docs) folder
- **Tenant Configuration**: See `utils/tenants.ts` for adding/modifying tenants
- **API Configuration**: See `utils/cockpitConfig.ts` for Cockpit CMS settings
- **Copilot Instructions**: See `.github/copilot-instructions.md` for AI development guidelines

## License

[CC-BY-4.0](LICENSE) - Creative Commons Attribution 4.0 International License
