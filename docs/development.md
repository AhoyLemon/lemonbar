## Local Development

### Prerequisites

This project uses [Bun](https://bun.sh) as its primary runtime and package manager for faster installs and better performance. However, it remains fully compatible with [Node.js](https://nodejs.org) & npm if you prefer.

**Option 1: Install [Bun](https://bun.com) (Recommended)**

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Or visit https://bun.sh/docs/installation for more options
```

**Option 2: Use Node.js/npm**

If you prefer to continue using npm, that works too! All commands work with both package managers.

### Install Dependencies

```bash
# With Bun (recommended)
bun install

# Or with npm
npm install
```

### Development

```bash
# With Bun
bun run dev

# Or with npm
npm run dev
```

Visit `http://localhost:3000`.

### Build for Production

```bash
# With Bun
bun run build
bun run preview

# Or with npm
npm run build
npm run preview
```

### Generate Static Site

```bash
# With Bun
bun run generate

# Or with npm
npm run generate
```
