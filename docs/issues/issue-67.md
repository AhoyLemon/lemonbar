# Goal: Redo the "Drinks Using This Bottle" section

## Problem

The `.drinks-section` box isn't finding cocktails for any drink that isn't flagged as `isFingers`. I'm thinking it's not correctly needs to be rewritten to find matching drinks

## Expected Behavior

- [x] When looking at the page for any bottle that has the `isFingers` flag, the page should show the 2 ways this bottle can be served: Straight Up or On The Rocks.
- [x] When looking at the page for any bottle that doesn't have the `isFingers` flag, the page should show some suggestions of different drinks that could be made from this bottle. It should source this information using a combination of the drinks in the Cockpit API and flesh it and whatever matches it can find using TheCocktailDB
  - [x] Hopefully this means that every bottle will have a list of between 3 and 12 cocktails you can make with this bottle, though we might have to play a bit with the logic to prioritize results.

## Planning

- [x] Start by reading this entire document
- [x] Then, do the work as required, checking off to do items, as you complete them
- [x] Then, test your code against the requirements and the Success Criteria at the bottom of this document
- [x] Then check your code for errors
- [x] Then report back to the user
- [ ] Finally, document what you did.

## Some APIs

| Endpoint                                                               | Description                                                                                                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| https://hirelemon.com/bar/api/content/item/lemonBar                    | Bar object for Lemon's inventory. Inside of this, you'll find a an array of `drinks`                                                                               |
| https://hirelemon.com/bar/api/content/item/sampleBar                   | Bar object for The Sample Bar's inventory. Inside of this, you'll find a an array of `drinks`                                                                      |
| https://hirelemon.com/bar/api/content/item/commonBar                   | Bar object for Lemon's inventory. Inside of this, you'll find a an array of `drinks`                                                                               |
| https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm} | This is the endpoint to search for drinks by ingredient on The CocktailDB. You can replace `${searchTerm}` with the name of the ingredient you want to search for. |

## How to Find Matches

1. Each bottle has a Name. This is the most interesting data point.
2. Each Bottle has a `baseSpirit`. This is a bit generic, but it's interesting because it's required and it could be one of the following: "Absinthe", "Aquavit", "Brandy", "Gin", "Liqueur", "Rum", "Tequila", "Vodka", "Whiskey", "Other Spirit"
3. Each bottle _should_ have one or more `tags`. These are interesting because they're more specific than the `baseSpirit`. There are a number of tags that are subgroups of a certain kind of spirit. For example, if you select a `baseSpirit` of "Whiskey", you might have tags like "Bourbon", "Rye", "Scotch", "Irish Whiskey", etc. These are more specific and could be really helpful for finding matches.
4. Each drink in the Cockpit API has a list of ingredients. Each ingredient has a `name`. Our goal is to find matches.
5. Each drink in The CocktailDB has the fields of `strIngredient1`, `strIngredient2` all the way up to `strIngredient15`. These are the ingredients for the drink. Our goal is to find matches here as well.

## Match Logic

1. Let's start by the most specific. Use the name of the bottle to find matches. If our bottle is named "Tanqueray", let's try to find a drink that has "Tanqueray" as an ingredient. This is the most specific and will give us the best results. We can use a simple string match for this, but we might want to do some normalization to account for things like "Tanqueray London Dry Gin" or "Tanqueray No. Ten".
2. The second place to look would be in tags. Our bottle of Tanqueray has a tag of "london dry gin. We can look for drinks that have "London Dry Gin" as an ingredient. This is a bit less specific, than the name but it will still give us good results.
   - Keep in mind that there can be 0 tags, and there may be multiple tags. So we should look for matches for each tag, and then combine the results.
3. The third place to look would be the `baseSpirit`. Our bottle of Tanqueray has a `baseSpirit` of "Gin". We can look for drinks that have "Gin" as an ingredient. This is the least specific, but it's basically guranteed to give results. eg: We'll always be able to find drinks by searching for "gin" as an ingredient, but we won't always be able to find drinks by searching for "Tanqueray" as an ingredient.
4. Let's keep widenening the net until we have at least 3 results.
5. If at any point we have more than 10 results, stop searching immediately and stick with what you have.
6. It's worth noting that we **DEFINITELY** care about the results from Cockpit way more than we do about the results from The CocktailDB. The CocktailDB is a nice bonus, but a lot of the data is messy, and a number of thier drinks are pretty questionable. So always prefer Cockpit drinks to The CocktailDB drinks.

## Sorting

Okay, let's say we have a list of 12 drinks that we found using all the logic above. How do we sort them? There should be some rules to our sorting.

1. As with http://localhost:3000/sample/drinks, we want to prefer drinks where we have those ingredients in stock. So if one of the drinks we found has 3 ingredients, and we have all 3 in stock, that should be ranked higher than a drink where we only have 2 of the 3 ingredients in stock.
2. Secondly we care about data source. So the drink that comes from that bar's local list of drinks should be ranked higher than a drink that we found on The CocktailDB. Also, if there's a tie where there's a drink from bar's local list and the a drink from the `commonBar` list, we like the local list better. So, if I'm looking at a bar in Lemon's inventory, the sorting goes:
   1. Drinks from `lemonBar.drinks`
   2. Drinks from `commonBar.drinks`
   3. Drinks from The CocktailDB
3. Thirdly, we care about the specificity of the match. So if we're looking at a bottle of "Tanqueray", and we have a drink that has "Tanqueray" as an ingredient, that should be ranked higher than a drink that has "London Dry Gin" as an ingredient, which should be ranked higher than a drink that has "Gin" as an ingredient. So that priority goes:
   1. Drinks that match the bottle name
   2. Drinks that match a tag
   3. Drinks that match the base spirit
4. After that, sort alphabetically by drink name

## Display

Okay, now we have our sorted array of drinks, now what?

1. The Headline should reflect the _most specific_ thing we found a match on. For example, if have a list of drinks for Tanquery, and we found at least one of those drinks by matching the name "Tanqueray", then the headline should be "Drinks Using Tanqueray". But if we didn't find any drinks that matched "Tanqueray" but we did find some that matched the tag "London Dry Gin", then the headline should be "Drinks Using London Dry Gin". And if we didn't find any drinks that matched the name or the tags, but we did find some that matched the base spirit "Gin", then the headline should be "Drinks Using Gin". So the priority for the headline goes:
   1. If we found any matches using the bottle name, headline is "Drinks Using [Bottle Name]"
   2. Else if we found any matches using a tag, headline is "Drinks Using [Tag Name]" (if there are multiple tags, just pick one of them to feature in the headline. Maybe the one that had the most matches?)
   3. Else if we found any matches using the base spirit, headline is "Drinks Using [Base Spirit]"
2. List the drinks in the sorted order we defined above. For each drink, we'll want to see...
   1. The name of the drink
   2. An image of the drink (if we have one)
   3. A list of the ingredients for the drink, with an indication of which ones we have in stock and which ones we don't have in stock.
   4. If we have all of the required ingredients in stock
      - If so, give this the `fully-available` class.
      - If not, give this the `has-missing-ingredients` class.
      - Bear in mind that we can give a drink the `fully-available` class if it's missing optional ingredeints, as long as all the required ingredients are in stock. So we need to be careful to check which ingredients are required and which are optional.
   5. Notes on missing ingredients:
      - If we're missing 1 or more required ingredients, we should say "X/Y required ingredients available", similar to pages\[tenant]\drinks\index.vue
      - If we're only missing optional ingredients, we should say "optional ingredient(s) missing", similar to pages\[tenant]\drinks\index.vue
      - If we have ALL ingredients, we should say "All ingredients available!", similar to pages\[tenant]\drinks\index.vue
3. An indicator if the the drink comes from The CocktailDB, similar to the `abbr.external-source` element on components\DrinkCard.vue
4. A button to view that drink (NuxtLink to the drink page)

## Loading State

1. While we're searching for drink matches, we need a loading state. Feel free to reference the `.loading.fetching-drinks` element on lines 40-52 of `pages\[tenant]\drinks\index.pug`
2. The loading indicator should be in the place where the drinks will eventually show up
3. The loading indicator should make the user aware of what we're searching for currently (ex: "Searching for drinks with Tanqueray...", "Searching for drinks with London Dry Gin...", "Searching for drinks with Gin...")
4. The loading indicator should show how many drinks we've found so far, but not actually show the links until it's done.
5. The loading indicator should have a button to stop the search. At that stage, the site will immediately stop searching for drinks and show the ones it has found (if any)

## Empty State

1. If it just so happens that we tried our best and didn't find any drinks, display a friendly message to that effect in place of the drink list

## Dealing with API Failure

1. This Search process relies on a number of calls to both Cockpit and TheCocktailDB. The Cockpit queries should NEVER fail (hopefully), but it's possible that the calls to TheCocktailDB could get rate limited, so...
2. Start by making the calls to Cockpit, they are the most important.
3. If we still need more drinks (we don't have 3+ drinks yet), then start making calls to TheCocktailDB.
4. If a call to TheCocktailDB fails, just catch the error and move on.
5. If you get 2 consecutive failures from TheCocktailDB, stop making calls to TheCocktailDB and just move forward with whatever you have.
6. If you end up with less than 3 drinks because of API failures, just display whatever you have.
7. But if you end up with less than 3 drinks because of API failures, show a message at the bottom of the list that says "API rate limit hit. Some drinks may be missing from this list."
8. If The CocktailDB does a successful search but doesn't find any results for that search term, the result will be `{"drinks":"no data found"}`

## Success Criteria

- [x] When looking at the page for any bottle that has the `isFingers` flag, the page should show the 2 ways this bottle can be served: Straight Up or On The Rocks.
- [x] When looking at the page for any bottle that doesn't have the `isFingers` flag, the page should show some suggestions of different drinks that could be made from this bottle. It should source this information using a combination of the drinks in the Cockpit API and flesh it and whatever matches it can find using TheCocktailDB
  - [x] Hopefully this means that every bottle will have a list of between 3 and 12 cocktails
- [x] To test that we can use a combination of Cockpit and TheCocktailDB, let's use "Cointreau" as an example
  - Cointreau is a bottle that doesn't have the `isFingers` flag, so we should see a list of cocktails that use Cointreau as an ingredient.
  - I can see the that `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Cointreau` endpoint gives me some results, so I should see a couple of those.
  - I created a test cocktail in Cockpit called "Cointreau Test Cocktail" that has Cointreau as an ingredient, so I should see that cocktail in the list as well.
  - [x] So if I go to `http://localhost:3000/sample/bottles/bottle-13` I should see a combination of a couple cocktails from TheCocktailDB and the "Cointreau Test Cocktail". The box should be titled "Drinks Using Cointreau"
- [x] I can click any drink listed in the "Drinks Using xxx" box to be taken to a page about that drink.

## Documentation

1. When you are complete, there should be some changes to the documentation...

- [x] A new file called `docs\bottles.md` should be created. It should describe the search and sort logic for finding drinks that match each bottle
- [x] `.github\copilot-instructions.md` should be reviewed and edited as needed to make sure the instructions are clear and up to date with the work that was done.
- [x] You can leave `README.md` alone
- [x] Feel free to suggest additional documentation files if you think there are other areas that should be documented as part of this work.

## Change Requests

- [x] There is no visual difference between those drinks sourced from Cockpit and those sourced from TheCocktailDB. Please add a visual indicator to each drink in the list. I will go back and pretty it up later.
- [x] While we're at it, let's add the capability of filtering. If the list of drinks happens to contain both drinks from Cockpit and drinks from TheCocktailDB, add three filter buttons: "All" | "Local" | "CocktailDB". All should be active by default.
  - [x] If the list of drinks is ONLY from Cockpit or ONLY from CocktailDB, don't show these filters
- [x] I'm looking at http://localhost:3000/sample/bottles/bottle-2 (Bulleit) and the second drink is "The Boulevardier". The URL for that is http://localhost:3000/sample/drinks/drink-3. Clicking the "View" button sucessfully brings up the page as expected, BUT if I try to open up http://localhost:3000/sample/drinks/drink-3 directly in a new window, it says "Drink Not Found"
- [x] On http://localhost:3000/sample/bottles/bottle-2 the fourth drink is "Paper Plane". The URL is http://localhost:3000/sample/drinks/common-4. Neither the View button nor the direct URL work. I suspect this is because pages\[tenant]\drinks\[id].vue doesn't have the appropriate logic to know how to pull the data for common drinks
- [x] None of the drinks from TheCocktailDB are working, ex http://localhost:3000/sample/drinks/cocktaildb-13194
- [x] The search is quite fast, which is wonderful! However, I want to see the UX for the searching, so please (TEMPORARILY!) throttle the requests so they go slowly. I want to be able to adjust the UX of the searching. Make sure that throttling is easy to revert.

☝️ In short, most of the problems are with rendering the correct individual drink that's linked from the /bottles/[id] page

## Change Requests 2

Using http://localhost:3000/sample/bottles/bottle-2 (Bulleit) as an example...

- [ ] For debugging purposes, let's have each listed drink display the string that was matched on, so just the text "whiskey", "bourbon", "bulleit", etc - I want to see what's happening here.
- [ ] Looking at the list, I'm noticng a number of drinks that make no sense here. I'll provide a screenshot, but "The Boulevardier" says "0/3 required ingredients available". But if that were true, this wouldn't be on the list at all. Logic dictates I need to at least have 1 ingredient if I'm looking at that drink in this context.
  - [ ] Digging further into The Boulevardier, if I visit http://localhost:3000/sample/drinks/drink-3 that page tells me I have 2/3 ingredients available (Bourbon & Campari)
  - The list says I have 0/3 required ingredients for "Brandon and Will's Coke Float"
    - If I visit http://localhost:3000/sample/drinks/cocktaildb-16447 it says I have 1/3 ingredients available (Bourbon)
- [ ] When http://localhost:3000/sample/bottles/bottle-2 is searching for drinks, I see these three strings, in this order...

    1. Searching for drinks with Bulleit...
    2. Searching for drinks with Whiskey...
    3. Searching for drinks with Bourbon...
    
    This doesn't make sense to me, because "bourbon" is a tag, whereas "Whiskey" is a baseSpirit. Therefore, "bourbon" should be searched BEFORE "whiskey"

    I will say the header says "Drinks Using bourbon", which is correct.

☝️ In short, the ingredient availability logic seems to be broken.
