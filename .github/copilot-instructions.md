# Lemonbar Development Guidelines

## Data Architecture - CLIENT-SIDE ONLY

**IMPORTANT**: All data fetching happens CLIENT-SIDE from Cockpit CMS API. There is NO server-side data storage or API routes.

### Data Source: Cockpit CMS

All bar inventory data is fetched directly from Cockpit CMS API at **https://hirelemon.com/bar/api** on the client side when pages load.

#### Data Types Fetched from Cockpit:

- **Bottles**: Individual spirits, liqueurs stored at `/content/items/bottles`
- **Drinks**: User-created cocktail recipes stored at `/content/items/drinks`
- **Essentials**: Ice, mixers, juices, syrups stored at `/content/item/essentials`
- **Beer & Wine**: Beer and wine inventory stored at `/content/item/beerWine`

#### API Configuration

API constants are defined in `/utils/cockpitConfig.ts`:
```typescript
export const COCKPIT_API_URL = "https://hirelemon.com/bar/api";
export const COCKPIT_API_KEY = "API-d8dddbef2be84368b83f4fefb0ff15a0f4bf7a8e";
```

**Note about API Key Security**: This API key has **read-only** permissions and is safe to expose publicly. It cannot create, edit, or delete data. More sensitive API keys with write permissions should NEVER be exposed.

#### Data Fetching Pattern

All data fetching uses the `useCockpitAPI()` composable:

```typescript
const { fetchBottles, fetchDrinks, fetchEssentials, fetchBeerWine } = useCockpitAPI();

// Fetch data client-side
const bottles = await fetchBottles();
const drinks = await fetchDrinks();
const essentials = await fetchEssentials();
const beerWine = await fetchBeerWine();
```

#### Error Handling

- If API calls fail, errors should be displayed prominently on the page
- Users should always know if data failed to load from Cockpit
- Never silently fail - always surface API errors to the user

### Deprecated Files

The following files/folders have been moved to `/deprecated/` and should NOT be used:
- `/deprecated/data/` - Old CSV and JSON files
- `/deprecated/public-data/` - Old static JSON files  
- `/deprecated/server-api/` - Old server API routes
- `/deprecated/scripts/` - Old data sync scripts
- `/deprecated/server-utils/` - Old server-side utilities

### Preferences (User-Owned Data)

User preferences are personal to each individual and should leverage localStorage. This includes:

- **Favorite Drinks**: User's saved favorite cocktails
- **Saved Searches**: Recently searched terms or filters
- **UI Preferences**: Theme settings, display options
- **Personal Notes**: Private notes about drinks or bottles

These items should **NOT** be stored in Cockpit CMS as they are user-specific.

### Future Improvements (TODO)

- **Caching**: Consider caching Cockpit API responses in `sessionStorage` to speed up repeated queries within the same session
- **Optimistic Updates**: For better UX, consider implementing optimistic UI updates while API calls are in flight

## Development Workflow

### Working with Bar Inventory

1. Update data directly in Cockpit CMS (https://hirelemon.com/bar)
2. Changes are immediately reflected on the live site (no build needed!)
3. Client-side composables fetch from Cockpit API when pages load

### Working with User Preferences

1. Use localStorage directly from the client
2. Implement proper serialization/deserialization
3. Handle missing or corrupt data gracefully
4. Consider adding export/import functionality for user backup

## Deployment to GitHub Pages

### Overview

This Nuxt 3 application is configured for automatic deployment to GitHub Pages using GitHub Actions. The deployment happens automatically on every push to the `main` branch.

### Configuration Details

#### Nuxt Configuration

The `nuxt.config.ts` file includes specific settings for GitHub Pages deployment:

```typescript
app: {
  baseURL: process.env.NODE_ENV === "production" ? "/lemonbar/" : "/",
  buildAssetsDir: "assets",
}

runtimeConfig: {
  cockpitApiKey: process.env.COCKPIT_API_KEY || "",
  public: {
    cockpitApiUrl: process.env.COCKPIT_API_URL || "https://hirelemon.com/bar/api",
    cockpitApiKey: process.env.COCKPIT_API_KEY || "",
  },
}
```

- **baseURL**: Set to `/lemonbar/` in production to match the GitHub Pages repository path
- **buildAssetsDir**: Set to `assets` to ensure proper asset loading
- **runtimeConfig**: Exposes Cockpit CMS API credentials to the client for live data fetching

#### Static Site Generation with Live Data

The deployment uses `npm run generate` which:

1. Builds the Nuxt application with the `static` preset
2. Pre-renders all routes (29 routes including pages and data payloads)
3. Generates static HTML files in `.output/public/`
4. Embeds Cockpit API credentials in the runtime config for client-side API calls
5. Creates a fully static site that fetches live data at runtime

#### GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow:

1. **Triggers**: On push to `main` or manual workflow dispatch
2. **Build Step**: 
   - Checks out code
   - Sets up Node.js 20 with npm caching
   - Runs `npm ci` for clean install
   - Runs `npm run generate` with environment variables:
     - `NODE_ENV=production`
     - `COCKPIT_API_URL` from GitHub secrets
     - `COCKPIT_API_KEY` from GitHub secrets
   - Uploads `.output/public/` as GitHub Pages artifact
3. **Deploy Step**:
   - Deploys the artifact to GitHub Pages
   - Provides deployment URL in workflow output

### Important Notes

1. **Live Data Fetching**: The deployed site fetches data directly from Cockpit CMS API at runtime using client-side API calls. This means data updates in Cockpit CMS are immediately reflected on the live site without requiring a rebuild.

2. **API Credentials**: The Cockpit API credentials are stored as GitHub repository secrets and embedded in the static site during build. These credentials enable client-side API calls to fetch live inventory, drinks, essentials, and beer/wine data.

3. **Client-Side Composables**: The app uses `useCockpitAPI()` composable to fetch data directly from Cockpit CMS. All data fetching happens in the browser, not on a server.

4. **External APIs**: TheCocktailDB API calls continue to work as they are client-side requests.

5. **Base URL**: The production baseURL `/lemonbar/` is hardcoded in the config. If you rename the repository, update this value in `nuxt.config.ts`.

6. **Repository Settings**: You must:
   - Enable GitHub Pages in repository settings and set the source to "GitHub Actions"
   - Configure GitHub secrets for `COCKPIT_API_URL` and `COCKPIT_API_KEY`

7. **Build Time**: The static generation process pre-renders all routes, making the deployed site extremely fast with no server-side rendering needed at runtime.

### Troubleshooting

- **404 errors on deployed site**: Check that baseURL in `nuxt.config.ts` matches your repository name
- **Assets not loading**: Verify buildAssetsDir is set to "assets" 
- **Workflow fails**: Check the Actions tab for detailed error logs
- **No data showing**: Verify GitHub secrets are configured correctly with valid Cockpit API credentials
- **CORS errors**: Ensure Cockpit CMS is configured to allow requests from your GitHub Pages domain
