## The Problem

- I set up the page of `/pages/[tenant]/drinks.vue` to see drinks available. However, over time, I've actually made the selection more straightforward. That page is now only interested in mixed drinks, not fingers, beer, or wine.
- Because of this, I think the page is poorly named.
- However, I still want drinks to resolve to something

## The Solution

- Let's rename the page to "Cocktails"
- And redirect `{tenant}/drinks` to `{tenant}/cocktails` so existing links don't break

## Acceptance Criteria

- [ ] The page at `/pages/[tenant]/drinks.vue` is renamed to `/pages/[tenant]/cocktails.vue`
- [ ] The page is titled "Cocktails" instead of "Drinks"
- [ ] A redirect is set up so that requests to `{tenant}/drinks` are redirected to `{tenant}/cocktails` (HTTP 301)
- [ ] The `error.vue` logic is such that it understands both "drinks" and "cocktails" as paths that would expect a tenant
- [ ] Everything that links to "drinks" now links to "cocktails" instead (e.g. the home page, the tenant config, the tests, etc)
- [ ] All tests pass with the new naming
- [ ] The documentation is updated to reflect the new naming and paths
- [ ] The prerender routes in `nuxt.config.ts` are updated to include the new "cocktails" paths and remove the old "drinks" paths
- [ ] Scan the rest of the codebase for any references to "drinks" that should be updated to "cocktails" and update them accordingly (e.g. type definitions, composables, etc)
- [ ] The new "cocktails" page should ONLY be interested in mixed drinks, and should include any API requests for beer, wine or fingers.

## Complications

- There's still the page of `pages\[tenant]\drinks\[id].vue` which actually makes more sense.
  - For example, http://localhost:3000/sample/drinks/finger-bottle-12-straight is a page for a "fingers" drink, not a cocktail.
  - And http://localhost:3000/sample/drinks/beer-beer-1-glass is a page for a beer, not a cocktail.
    🤔
