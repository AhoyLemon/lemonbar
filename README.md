# 🍸 The Headless Bar

A custom bar inventory and cocktail app built with Nuxt 3.

## Features

- **Inventory Management**: Track your bottles with size, state, and images
- **Recipe Discovery**: Find cocktails from TheCocktailDB API
- **Smart Matching**: See which drinks you can make with your current inventory
- **Non-Alcoholic Support**: Includes mocktails, beer, and wine recipes
- **Data Sync**: Import from Notion API, CSV, or local JSON files

## Getting Started

### Install Dependencies

```bash
npm install
```

### Sync Your Inventory Data

```bash
npm run sync-data
```

This will read from `data/inventory.csv` and `data/recipes.json` and generate normalized JSON files in `public/data/`.

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Generate Static Site

```bash
npm run generate
```

## Data Structure

### Inventory CSV

Your `data/inventory.csv` should have these columns:

- `id`, `name`, `category`, `tags`, `inStock`, `bottleSize`, `bottleState`, `image`

### Recipes JSON

Your `data/recipes.json` should follow this structure:

```json
{
  "recipes": [
    {
      "id": "custom-1",
      "name": "Recipe Name",
      "ingredients": [{ "name": "Ingredient", "qty": "2 oz" }],
      "instructions": "Mix and serve",
      "category": "Category",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

### Notion Integration (Optional)

Set environment variables:

- `NOTION_API_KEY` - Your Notion integration token
- `NOTION_DATABASE_ID` - Your database ID (from the URL)

The sync script will automatically fetch from Notion if these are present. When both Notion and CSV sources are available, Notion data takes priority.

#### Setting up Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations) and create a new integration
2. Copy the "Internal Integration Token" - this is your `NOTION_API_KEY`
3. Open your Liquor Cabinet database in Notion
4. Click "Share" and invite your integration
5. Copy the database ID from the URL - it's the part after your workspace name and before the `?` (e.g., in `https://notion.so/workspace/5b1bdce9e76e4da5a6150bf0a8a08505?v=...`, the ID is `5b1bdce9e76e4da5a6150bf0a8a08505`)
6. Create a `.env` file in the project root with:

```bash
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=5b1bdce9e76e4da5a6150bf0a8a08505
```

7. Run `npm run sync-data` to fetch from Notion

### Managing Inventory via Web Interface

You can add, edit, and delete bottles directly from the web interface:

1. Start the development server: `npm run dev`
2. Navigate to `/inventory`
3. Click "Manage Inventory" button
4. Use the form to add new bottles or click "Edit" on existing bottles to modify them

Changes made through the web interface will update `data/inventory.csv` immediately. Run `npm run sync-data` afterward to regenerate the public JSON files.

## Testing


```bash
npm test
```

## Code Formatting

```bash
npm run format
```

## License

MIT
