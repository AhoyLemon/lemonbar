# Lemonbar Development Guidelines

## Data Storage Architecture

### Inventory (Bar-Owned Data)

All inventory items belong to the bar and should be saved in JSON format on the server side. This includes:

- **Bottles**: Individual spirits, liqueurs, wines, beers stored in `public/data/bottles.json`
- **Essentials**: Ice, mixers, juices, syrups, and other non-bottled ingredients stored in `public/data/essentials.json`
- **Garnishes**: Bitters, cherries, olives, and other garnish items
- **Custom Drinks**: User-created cocktail drinks stored in `public/data/drinks.json`

These items should **NOT** use localStorage as they are part of the bar's inventory and need to persist across all users and browser sessions.

### Preferences (User-Owned Data)

User preferences are personal to each individual and should leverage localStorage. This includes:

- **Favorite Drinks**: User's saved favorite cocktails
- **Saved Searches**: Recently searched terms or filters
- **UI Preferences**: Theme settings, display options
- **Personal Notes**: Private notes about drinks or bottles

These items should **NOT** be stored in JSON files as they are user-specific.

## Future Migration Plans

### Current State

Currently, all bar inventory is stored in the `public/data` directory as JSON files:

- `public/data/bottles.json` - Bottle inventory
- `public/data/essentials.json` - Essential ingredients
- `public/data/drinks.json` - Cocktail drinks

### Future State

We plan to migrate the data storage to a more robust backend solution to allow for:

- Real-time inventory updates without rebuilding the site
- Better data management and editing capabilities
- Multi-user access and synchronization

**Potential Solutions:**

- **Notion**: Already partially integrated for inventory syncing
- **Firebase**: Low-cost, real-time database with good free tier
- **Other cheap/free solutions**: Supabase, PocketBase, or similar

### Migration Considerations

When implementing new features:

1. Keep data access abstracted (use composables/services)
2. Avoid tight coupling to the current JSON file structure
3. Design APIs that can easily be swapped for external services
4. Document data schemas clearly for easier migration
5. Use TypeScript types consistently to ensure data integrity

## Development Workflow

When adding new inventory items:

1. Add data to the appropriate source (CSV, Notion, or JSON in `data/`)
2. Run `npm run sync-data` to regenerate `public/data/*.json` files
3. Server API endpoints will serve the data from `public/data/`
4. Client-side composables fetch from server APIs

When working with user preferences:

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
```

- **baseURL**: Set to `/lemonbar/` in production to match the GitHub Pages repository path
- **buildAssetsDir**: Set to `assets` to ensure proper asset loading

#### Static Site Generation

The deployment uses `npm run generate` which:

1. Builds the Nuxt application with the `static` preset
2. Pre-renders all routes (29 routes including pages and data payloads)
3. Generates static HTML files in `.output/public/`
4. Includes all data files from `public/data/` in the build
5. Creates a fully static site that can be served from any static hosting

#### GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow:

1. **Triggers**: On push to `main` or manual workflow dispatch
2. **Build Step**: 
   - Checks out code
   - Sets up Node.js 20 with npm caching
   - Runs `npm ci` for clean install
   - Runs `npm run generate` with NODE_ENV=production
   - Uploads `.output/public/` as GitHub Pages artifact
3. **Deploy Step**:
   - Deploys the artifact to GitHub Pages
   - Provides deployment URL in workflow output

### Important Notes

1. **Data Files**: All inventory data in `public/data/` is automatically included in the static build. The site will serve this data as static JSON files.

2. **API Calls**: External API calls to `hirelemon.com/bar/api` and `thecocktaildb.com/api` will work in production as they are client-side requests.

3. **Base URL**: The production baseURL `/lemonbar/` is hardcoded in the config. If you rename the repository, update this value in `nuxt.config.ts`.

4. **Repository Settings**: You must enable GitHub Pages in repository settings and set the source to "GitHub Actions" for the deployment to work.

5. **Build Time**: The static generation process pre-renders all routes, making the deployed site extremely fast with no server-side rendering needed at runtime.

### Troubleshooting

- **404 errors on deployed site**: Check that baseURL in `nuxt.config.ts` matches your repository name
- **Assets not loading**: Verify buildAssetsDir is set to "assets" 
- **Workflow fails**: Check the Actions tab for detailed error logs
- **Data not updating**: Run `npm run sync-data` before committing to update the JSON files in `public/data/`
