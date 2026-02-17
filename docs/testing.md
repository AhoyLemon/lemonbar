## Testing

This project uses Vitest for unit tests. Tests live in the `tests/` folder and are executed via the `test` script in `package.json`.

Quick commands

- Install dependencies:

```bash
# With Bun
bun install

# Or with npm
npm install
```

- Run the full test suite:

```bash
# With Bun
bun test

# Or with npm
npm test
```

- Run tests in watch mode:

```bash
npm run test:watch
```

- Run a single test file:

```bash
# using npx (works without changing package.json)
npx vitest run tests/useCocktails.test.ts
```

- Run tests matching a name or pattern:

```bash
# Run tests whose titles match 'cocktails'
npx vitest -t 'cocktails'
```

- Generate coverage (Vitest supports coverage flags):

```bash
npx vitest run --coverage
```

Troubleshooting

- If tests fail due to missing globals (DOM APIs), Vitest is configured with `happy-dom` in the dev dependencies. Ensure dependencies are installed.
- If a test hangs, try `npx vitest --run --threads=false` to simplify the runtime.

Where to look

- Unit tests: `tests/` (examples: `useCocktails.test.ts`, `beerWineDrinkParsing.test.ts`)
- Vitest config: `vitest.config.ts`

If you want, I can add a convenience npm script for running a single test file or for generating coverage consistently across Bun/npm.
