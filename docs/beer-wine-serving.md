# Beer and Wine Serving Pages

This document describes the beer and wine serving pages feature that allows users to view different serving options for beers and wines.

## Overview

Similar to the "fingers" feature for special occasion bottles, beer and wine items now have dedicated serving option pages with detailed instructions for each serving style.

## URL Structure

### Beer Serving Options
- **In a Glass**: `/{tenant}/drinks/beer-{beerId}-glass`
  - Example: `/lemon/drinks/beer-ipa-pale-ale-glass`
- **From the Bottle**: `/{tenant}/drinks/beer-{beerId}-bottle`
  - Example: `/lemon/drinks/beer-ipa-pale-ale-bottle`

### Wine Serving Options
- **In a Glass**: `/{tenant}/drinks/wine-{wineId}-glass`
  - Example: `/lemon/drinks/wine-cabernet-sauvignon-glass`
- **In a Glass with Ice**: `/{tenant}/drinks/wine-{wineId}-ice`
  - Example: `/lemon/drinks/wine-cabernet-sauvignon-ice`

## Available Page Integration

On the Available page (`/{tenant}/available`), each beer and wine card displays clickable serving option links:

### Beer Cards Show:
- "In a Glass" → Links to beer serving page with glass option
- "From the Bottle" → Links to beer serving page with bottle option

### Wine Cards Show:
- "In a Glass" → Links to wine serving page with glass option
- "With Ice" → Links to wine serving page with ice option (humorous content)

## Beer Serving Instructions

### Beer in a Glass
**Ingredients:**
- {beerName} | 1
- Glass | 1

**Instructions:**
1. Ask for a {beerName} **in a glass**
2. Wait for the {beerName} to be poured into a glass for you.
3. Drink it
4. If you order another one, don't get all pissy if they use the same glass for your second beer.

### Beer from the Bottle
**Ingredients:**
- {beerName} | 1

**Instructions:**
1. Ask for a {beerName}
2. Wait for the {beerName} to be handed to you.
3. Thank the person who gave you a beer.

## Wine Serving Instructions

### Wine in a Glass
**Ingredients:**
- {wineName} | 5 oz
- Glass | 1

**Instructions:**
1. Ask for a glass of {wineName}
2. Drink the {wineName} when it's given to you

### Wine in a Glass with Ice
**Ingredients:**
- {wineName} | 5 oz
- Glass | 1
- Ice!?

**Instructions:**
1. Ask for a glass of {wineName}, but nervously ask if you can have ice in your glass
2. Make direct eye contact with the person you're talking to.
3. Try to hide the shame you feel
4. When finally presented with your iced glass of {wineName}, drink it quickly, and talk endlessly about how, in other countries, it's actually pretty normal to order a glass of wine with ice
5. Avoid eye contact from then on.

## Technical Implementation

### Files Modified
1. **`pages/[tenant]/available/index.vue`**: Updated beer/wine cards to include clickable NuxtLink options instead of plain text
2. **`pages/[tenant]/drinks/[id].vue`**: Added logic to detect and parse beer/wine drink IDs, load beer/wine data
3. **`pages/[tenant]/drinks/id.pug`**: Added dedicated display sections for beer and wine drinks with serving instructions

### ID Parsing Logic

The drink ID parser detects prefixes and extracts the item ID and serving style:

```typescript
// Beer: "beer-ipa-pale-ale-glass" → { beerId: "ipa-pale-ale", servingStyle: "glass" }
// Wine: "wine-chardonnay-ice" → { wineId: "chardonnay", servingStyle: "ice" }
```

The parser uses `lastIndexOf("-")` to handle item IDs that contain hyphens.

### State Management

Each beer/wine item is loaded using the `useBeerWine` composable:
- `loadBeerWine()` - Loads all beer and wine items from Cockpit CMS
- `beerWineItems` - State array containing all items
- Items are filtered by type (`beer` or `wine`) and matched by ID

## Adding New Serving Options

To add new serving options (e.g., "in a can", "decanted"):

1. **Add the URL pattern**: Update available page links to include new option
2. **Add parsing logic**: Update `pages/[tenant]/drinks/[id].vue` to recognize new serving style
3. **Add display template**: Add new section in `pages/[tenant]/drinks/id.pug` with ingredients and instructions
4. **Add tests**: Create test cases in `tests/beerWineDrinkParsing.test.ts`

## Testing

Unit tests are available in `tests/beerWineDrinkParsing.test.ts` that verify the ID parsing logic for:
- Simple IDs
- Hyphenated IDs
- Multiple hyphens in IDs
- Both serving styles

Run tests with:
```bash
npm test tests/beerWineDrinkParsing.test.ts
```
