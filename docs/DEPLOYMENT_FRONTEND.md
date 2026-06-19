# Frontend Deployment Guide

Your React Frontend is now fully configured and optimized for production deployment! All deployment-breaking blockers have been resolved.

## 1. What was Modified
- **Environment Variables**: The hardcoded API URL in `api.js` was replaced with `import.meta.env.VITE_API_URL`. This allows you to point the live frontend to your live cloud backend without changing code!
- **Routing Safety**: `BrowserRouter` was replaced with `HashRouter` (e.g. `/#/logistics`). This guarantees 100% compatibility across static hosts (GitHub Pages) and edge hosts (Vercel) without complex rewrite rules.
- **Vite Configuration**: `vite.config.js` was upgraded to dynamically adjust the base path depending on whether Vercel is compiling it or if it's being pushed to GitHub Pages.
- **Deploy Scripts**: `package.json` now includes the `deploy` and `predeploy` hooks using the `gh-pages` module.

## 2. Setting Up the Environment Variable

Before deploying, you must configure the environment variable to point to your live Java backend (from Render/Railway).

**For GitHub Pages**:
1. Create a `.env.production` file in your `frontend/` folder.
2. Add: `VITE_API_URL=https://your-java-backend-url.onrender.com/api`
3. Vite will automatically embed this during the build step.

**For Vercel**:
1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-java-backend-url.onrender.com/api`

---

## 3. Option A: Deploying to GitHub Pages (Recommended)

GitHub Pages is built-in, completely free, and directly attached to your repository.

1. Ensure your `package.json` has the `"homepage"` field pointing to your repository (e.g., `"https://username.github.io/SupplyChain"`). Note: I have left this up to you so you can put your exact GitHub username!
2. Open your terminal in the `frontend` folder.
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. This will automatically compile a production build and push the `dist/` folder to a new `gh-pages` branch on your repository.
5. Go to your GitHub Repository > **Settings** > **Pages** and ensure it's serving from the `gh-pages` branch. 
6. Your site is live!

---

## 4. Option B: Deploying to Vercel (Alternative)

Vercel offers global edge caching and automatic CI/CD deployments on every git push.

1. Create a free account at [Vercel.com](https://vercel.com).
2. Click **Add New Project** and import your GitHub repository.
3. **Framework Preset**: Vite
4. **Root Directory**: `frontend` (Make sure to select the `frontend` folder, not the root of the Java repo!)
5. Configure your Environment Variables (See Section 2).
6. Click **Deploy**. Vercel handles the rest automatically!
