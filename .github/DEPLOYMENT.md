# GitHub Pages Deployment Setup

## Initial Setup Steps

After merging this PR, follow these steps to enable GitHub Pages deployment:

### 1. Verify API Configuration

Before deploying, make sure the API paths in `utils/cockpitConfig.ts` are correct:

```typescript
export const COCKPIT_API_URL = "https://your-cockpit-instance/api";
export const COCKPIT_IMAGE_URL = "https://your-image-host/storage/uploads";
export const COCKPIT_API_KEY = "your-api-key-here";
```

These values are the single source of truth for all API and image URLs. No environment variables or GitHub secrets are needed for API configuration.

### 2. Enable GitHub Pages

1. Go to your repository: `https://github.com/AhoyLemon/booz`
2. Click on **Settings** (top navigation)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select **"GitHub Actions"** from the dropdown
5. Click **Save** (if needed)

### 3. Trigger the First Deployment

The workflow will automatically run when you:

- Push to the `main` branch
- Manually trigger it from the Actions tab

To manually trigger the deployment:

1. Go to the **Actions** tab
2. Select "Deploy to GitHub Pages" from the left sidebar
3. Click **Run workflow** (button on the right)
4. Select `main` branch
5. Click **Run workflow**

### 4. View Your Deployed Site

Once the workflow completes (usually 2-5 minutes):

1. Go to the **Actions** tab to monitor progress
2. Once complete, your site will be live at:
   - **URL**: `https://ahoylemon.github.io/booz/`
3. You can also find the URL in:
   - Repository **Settings** → **Pages** section
   - The workflow run summary under "github-pages" environment

## Workflow Details

The deployment workflow:

- **Triggers**: Automatically on push to `main` branch
- **Build**: Runs `npm run generate` to create static files
- **Deploy**: Uploads to GitHub Pages using official GitHub Actions
- **Output**: Static site in `.output/public/` directory

## Troubleshooting

### Workflow Doesn't Appear

- Make sure the `.github/workflows/deploy.yml` file exists in the `main` branch
- Check the **Actions** tab for any workflow runs

### Deployment Fails

1. Click on the failed workflow run in the **Actions** tab
2. Check the logs for specific error messages
3. Common issues:
   - Missing dependencies: Check `package.json`
   - Build errors: Test locally with `npm run generate`
   - Permission issues: Verify repository settings allow Actions

### 404 Errors on Deployed Site

- Verify the `baseURL` in `nuxt.config.ts` matches `/`
- If you renamed the repository, update the baseURL accordingly

### Data Not Showing

- Verify API paths in `utils/cockpitConfig.ts` are correct
- Check browser console for API errors
- Make sure your Cockpit CMS instance is accessible from the browser

## Updating the Site

To deploy updates:

1. Make your changes locally
2. Test with `npm run dev`
3. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. The workflow will automatically build and deploy your changes
5. Site will be updated in 2-5 minutes

## Local Preview of Production Build

To test the production build locally before deploying:

```bash
npm run generate
npx serve .output/public
```
