## Set all API paths in cockpitConfig

### Issue

I have some values where `hirelemon.com/bar` is hardcoded, and I'd like to change those all to being set in a single place for easy switching. Eventually, this project will not use `hirelemon.com` at all.\

While we're at it, the concept of `env` files is now deprecated in this project, and we want to remove all `env` files as well as the `dotenv` package. So we should also move the API path out of the `env` file and into `cockpitConfig.ts`.

This project USED TO use the Notion API. It no longer does. So we can remove `notionhq/client` as a dependency, and remove all code related to the Notion API. This includes any references to `NOTION_API_KEY` and `NOTION_DATABASE_ID`.

### Solution

- [x] Add a new variable of `COCKPIT_IMAGE_URL` to `cockpitConfig.ts`. This should be set to `https://my.booz.bar/storage/uploads`. This is the path that will be used for all images pulled from the API.
- [x] Wherever `hirelemon.com/bar` is used, replace it with either `COCKPIT_API_URL` or `COCKPIT_IMAGE_URL` depending on the context.
- [x] Update documentation as necessary

### Acceptance Criteria

- [x] the string `hirelemon.com` is only in `cockpitConfig.ts` and nowhere else in the codebase
- [x] dotenv and Notion are no longer used anywhere in the codebase
- [x] All pug files will reference these variables for API paths and image paths, and not hardcoded strings
- [x] README.md and .github\copilot-instructions.md are updated to reflect these changes.
- [x] .github\DEPLOYMENT.md is no longer concerned with GitHub secrets, instead making sure you have the correct API paths set in `cockpitConfig.ts` before deploying.
