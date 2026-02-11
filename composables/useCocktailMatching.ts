import type { Bottle, Drink } from "~/types";

interface SearchResult {
  drinks: Drink[];
  matchType: "name" | "tag" | "baseSpirit" | null;
  matchedTerm: string;
}

interface MatchedDrink extends Drink {
  source: "local" | "common" | "external";
  matchType: "name" | "tag" | "baseSpirit";
  matchedTerm: string;
}

// ⏱️ TEMPORARY THROTTLING - Easy to remove
// Set to 0 to remove throttling completely
const SEARCH_DELAY_MS = 400; // Delay between search steps for UX testing
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// ⏱️ END TEMPORARY THROTTLING

export const useCocktailMatching = (tenantSlug?: string) => {
  const searching = ref(false);
  const searchingFor = ref("");
  const foundCount = ref(0);
  const stopSearchRequested = ref(false);
  const apiFailureCount = ref(0);
  const showRateLimitMessage = ref(false);

  // Normalize a string for comparison (lowercase, remove extra spaces)
  const normalize = (str: string): string => str.toLowerCase().trim();

  // Check if ingredient name contains the search term
  const ingredientMatches = (ingredientName: string, searchTerm: string): boolean => {
    const normIngredient = normalize(ingredientName);
    const normTerm = normalize(searchTerm);

    // Exact match
    if (normIngredient === normTerm) return true;

    // Contains as a word (with word boundaries)
    const regex = new RegExp(`\\b${normTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return regex.test(ingredientName);
  };

  // Fetch drinks from CocktailDB by ingredient
  const fetchFromCocktailDB = async (searchTerm: string): Promise<Drink[]> => {
    try {
      const endpoint = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(searchTerm)}`;
      const response = await $fetch<{
        drinks: Array<{ idDrink: string; strDrink: string; strDrinkThumb: string }> | string | null;
      }>(endpoint);

      // Handle "no data found" response
      if (!response.drinks || response.drinks === "no data found" || typeof response.drinks === "string") {
        return [];
      }

      // Reset failure count on success
      apiFailureCount.value = 0;

      // Get full drink details for each result (limit to 10)
      const drinksToFetch = response.drinks.slice(0, 10);
      const theCocktailDB = useTheCocktailDB();
      const fullDrinks: Drink[] = [];

      for (const drink of drinksToFetch) {
        if (stopSearchRequested.value) break;

        const fullDrink = await theCocktailDB.fetchCocktailDBDrinkById(drink.idDrink);
        if (fullDrink) {
          fullDrinks.push(fullDrink);
        }
      }

      return fullDrinks;
    } catch (e) {
      console.error(`Failed to fetch drinks from CocktailDB for "${searchTerm}":`, e);
      apiFailureCount.value++;
      return [];
    }
  };

  // Find matching drinks for a bottle
  const findMatchingDrinks = async (bottle: Bottle): Promise<SearchResult> => {
    searching.value = true;
    searchingFor.value = "";
    foundCount.value = 0;
    stopSearchRequested.value = false;
    apiFailureCount.value = 0;
    showRateLimitMessage.value = false;

    const cockpitAPI = useCockpitAPI(tenantSlug);
    const allMatches: MatchedDrink[] = [];
    let matchType: "name" | "tag" | "baseSpirit" | null = null;
    let matchedTerm = "";

    try {
      // Step 1: Fetch drinks from Cockpit (local + common)
      searchingFor.value = "Loading local drinks...";
      const [localDrinks, commonDrinks] = await Promise.all([cockpitAPI.fetchDrinks(), cockpitAPI.fetchDrinksCommon()]);

      // Helper to check if a drink matches search term
      const drinkMatches = (drink: Drink, searchTerm: string): boolean => {
        return drink.ingredients.some((ing) => ingredientMatches(ing.name, searchTerm));
      };

      // Step 2: Search by bottle name (most specific)
      if (bottle.name) {
        searchingFor.value = `Searching for drinks with ${bottle.name}...`;
        if (SEARCH_DELAY_MS > 0) await delay(SEARCH_DELAY_MS); // ⏱️ TEMPORARY

        // Check local drinks
        const localMatches = localDrinks.filter((d) => drinkMatches(d, bottle.name));
        localMatches.forEach((d) => {
          allMatches.push({
            ...d,
            source: "local",
            matchType: "name",
            matchedTerm: bottle.name,
          });
        });

        // Check common drinks
        const commonMatches = commonDrinks.filter((d) => drinkMatches(d, bottle.name));
        commonMatches.forEach((d) => {
          allMatches.push({
            ...d,
            source: "common",
            matchType: "name",
            matchedTerm: bottle.name,
          });
        });

        foundCount.value = allMatches.length;

        // If we found matches and need more, try CocktailDB
        if (allMatches.length > 0) {
          matchType = "name";
          matchedTerm = bottle.name;

          if (allMatches.length < 10 && !stopSearchRequested.value && apiFailureCount.value < 2) {
            const externalMatches = await fetchFromCocktailDB(bottle.name);
            externalMatches.forEach((d) => {
              if (drinkMatches(d, bottle.name)) {
                allMatches.push({
                  ...d,
                  source: "external",
                  matchType: "name",
                  matchedTerm: bottle.name,
                });
              }
            });
            foundCount.value = allMatches.length;
          }
        }

        // Stop if we have enough drinks
        if (allMatches.length >= 3) {
          searching.value = false;
          return {
            drinks: allMatches.slice(0, 10), // Limit to 10
            matchType,
            matchedTerm,
          };
        }
      }

      // Step 3: Search by tags (medium specificity)
      if (bottle.tags && bottle.tags.length > 0 && !stopSearchRequested.value) {
        for (const tag of bottle.tags) {
          if (stopSearchRequested.value || apiFailureCount.value >= 2) break;

          searchingFor.value = `Searching for drinks with ${tag}...`;
          if (SEARCH_DELAY_MS > 0) await delay(SEARCH_DELAY_MS); // ⏱️ TEMPORARY

          // Check local drinks
          const localMatches = localDrinks.filter((d) => drinkMatches(d, tag) && !allMatches.some((m) => m.id === d.id));
          localMatches.forEach((d) => {
            allMatches.push({
              ...d,
              source: "local",
              matchType: "tag",
              matchedTerm: tag,
            });
          });

          // Check common drinks
          const commonMatches = commonDrinks.filter((d) => drinkMatches(d, tag) && !allMatches.some((m) => m.id === d.id));
          commonMatches.forEach((d) => {
            allMatches.push({
              ...d,
              source: "common",
              matchType: "tag",
              matchedTerm: tag,
            });
          });

          foundCount.value = allMatches.length;

          // If we found matches for this tag and need more, try CocktailDB
          if (allMatches.length > 0 && !matchType) {
            matchType = "tag";
            matchedTerm = tag;
          }

          if (allMatches.length < 10 && apiFailureCount.value < 2) {
            const externalMatches = await fetchFromCocktailDB(tag);
            externalMatches.forEach((d) => {
              if (drinkMatches(d, tag) && !allMatches.some((m) => m.id === d.id)) {
                allMatches.push({
                  ...d,
                  source: "external",
                  matchType: "tag",
                  matchedTerm: tag,
                });
              }
            });
            foundCount.value = allMatches.length;
          }

          // Stop if we have enough drinks
          if (allMatches.length >= 10) break;
        }

        if (allMatches.length >= 3) {
          searching.value = false;
          return {
            drinks: allMatches.slice(0, 10),
            matchType,
            matchedTerm,
          };
        }
      }

      // Step 4: Search by baseSpirit (least specific, guaranteed results)
      if (bottle.baseSpirit && !stopSearchRequested.value && apiFailureCount.value < 2) {
        if (SEARCH_DELAY_MS > 0) await delay(SEARCH_DELAY_MS); // ⏱️ TEMPORARY
        searchingFor.value = `Searching for drinks with ${bottle.baseSpirit}...`;

        // Check local drinks
        const localMatches = localDrinks.filter((d) => drinkMatches(d, bottle.baseSpirit) && !allMatches.some((m) => m.id === d.id));
        localMatches.forEach((d) => {
          allMatches.push({
            ...d,
            source: "local",
            matchType: "baseSpirit",
            matchedTerm: bottle.baseSpirit,
          });
        });

        // Check common drinks
        const commonMatches = commonDrinks.filter((d) => drinkMatches(d, bottle.baseSpirit) && !allMatches.some((m) => m.id === d.id));
        commonMatches.forEach((d) => {
          allMatches.push({
            ...d,
            source: "common",
            matchType: "baseSpirit",
            matchedTerm: bottle.baseSpirit,
          });
        });

        foundCount.value = allMatches.length;

        if (!matchType) {
          matchType = "baseSpirit";
          matchedTerm = bottle.baseSpirit;
        }

        // Try CocktailDB if we need more
        if (allMatches.length < 10 && apiFailureCount.value < 2) {
          const externalMatches = await fetchFromCocktailDB(bottle.baseSpirit);
          externalMatches.forEach((d) => {
            if (drinkMatches(d, bottle.baseSpirit) && !allMatches.some((m) => m.id === d.id)) {
              allMatches.push({
                ...d,
                source: "external",
                matchType: "baseSpirit",
                matchedTerm: bottle.baseSpirit,
              });
            }
          });
          foundCount.value = allMatches.length;
        }
      }

      // Show rate limit message if we have < 3 drinks and had API failures
      if (allMatches.length < 3 && apiFailureCount.value >= 2) {
        showRateLimitMessage.value = true;
      }

      searching.value = false;
      return {
        drinks: allMatches.slice(0, 10),
        matchType,
        matchedTerm,
      };
    } catch (e) {
      console.error("Failed to find matching drinks:", e);
      searching.value = false;
      return {
        drinks: [],
        matchType: null,
        matchedTerm: "",
      };
    }
  };

  // Sort drinks by availability, source, match specificity, then alphabetically
  const sortMatchedDrinks = (drinks: MatchedDrink[], isIngredientInStock: (name: string) => boolean, isStarredFn: (id: string) => boolean): MatchedDrink[] => {
    return [...drinks].sort((a, b) => {
      // Calculate availability percentage (required ingredients only)
      const getAvailability = (drink: Drink): number => {
        const required = drink.ingredients.filter((ing) => !ing.optional);
        if (required.length === 0) return 0;
        const available = required.filter((ing) => isIngredientInStock(ing.name)).length;
        return (available / required.length) * 100;
      };

      const aAvail = getAvailability(a);
      const bAvail = getAvailability(b);

      // 1. Sort by availability (descending)
      if (aAvail !== bAvail) {
        return bAvail - aAvail;
      }

      // 2. Sort by starred status
      const aStarred = isStarredFn(a.id);
      const bStarred = isStarredFn(b.id);
      if (aStarred && !bStarred) return -1;
      if (bStarred && !aStarred) return 1;

      // 3. Sort by data source (local > common > external)
      const sourceOrder = { local: 0, common: 1, external: 2 };
      const aSource = sourceOrder[a.source];
      const bSource = sourceOrder[b.source];
      if (aSource !== bSource) {
        return aSource - bSource;
      }

      // 4. Sort by match specificity (name > tag > baseSpirit)
      const matchOrder = { name: 0, tag: 1, baseSpirit: 2 };
      const aMatch = matchOrder[a.matchType];
      const bMatch = matchOrder[b.matchType];
      if (aMatch !== bMatch) {
        return aMatch - bMatch;
      }

      // 5. Sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  };

  const stopSearch = () => {
    stopSearchRequested.value = true;
  };

  return {
    searching,
    searchingFor,
    foundCount,
    showRateLimitMessage,
    findMatchingDrinks,
    sortMatchedDrinks,
    stopSearch,
  };
};
