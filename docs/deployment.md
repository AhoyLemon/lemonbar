## Deployment

### GitHub Pages

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch. The deployed site fetches live data from your Cockpit CMS API.

#### Initial Setup

1. **Enable GitHub Pages in Repository Settings**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", set:
     - **Source**: "GitHub Actions"

2. **Push to Main Branch**:

```bash
git push origin main
```

3. **Monitor Deployment**:
   - Go to the **Actions** tab in your repository
   - You should see the "Deploy to GitHub Pages" workflow running
   - Once complete, your site will be available at: `https://booz.bar/`

#### Multi-Tenant URLs

Once deployed, your tenants will be accessible at:

- `https://booz.bar/` (Home Page)
- `https://booz.bar/about` - About Page
- `https://booz.bar/foo` - Home page for a tenant named "foo"
- `https://booz.bar/foo/available` - Available drinks for "foo"

#### How It Works

The deployed site fetches data directly from your Cockpit CMS API at runtime. This means:

- Visitors see fresh, up-to-date inventory and drink data
- No need to rebuild/redeploy when data changes in Cockpit CMS
- Updates to your CMS are immediately reflected on the live site
- Each tenant fetches from their configured Cockpit collections

#### Manual Deployment

You can also trigger a deployment manually:

1. Go to the **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow**

#### Local Preview of Production Build

```bash
# With Bun
bun run generate
bunx serve .output/public

# Or with npm
npm run generate
npx serve .output/public
```

The site will be available at `http://localhost:3000`
