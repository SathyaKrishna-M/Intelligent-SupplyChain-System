# Master Deployment Guide: Full Stack Supply Chain

Deploying a full-stack application requires a specific order of operations. You **must deploy the backend first** so that you have a live API URL to give to the frontend before it compiles.

Follow these steps exactly in order.

---

## PART 1: Deploying the Java Backend (Render)

We will use Render.com to host your Java backend because it natively supports Docker and offers free persistent storage.

### 1. Push Your Code to GitHub
Ensure all recent changes to the repository are committed and pushed to your GitHub account.
```bash
git add .
git commit -m "Prepared for Deployment"
git push
```

### 2. Create the Web Service
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `SupplyChain` repository.
4. **Environment**: Docker (Render will automatically detect the `Dockerfile` we created).

### 3. Attach Persistent Storage (CRITICAL)
If you skip this step, your database files (`users.txt`, `orders.txt`) will be wiped out every time the server restarts!
1. Scroll down to **Advanced** settings.
2. Click **Add Disk**.
3. **Name**: `supply-chain-data`
4. **Mount Path**: `/app/persistent_data`
5. **Size**: 1GB (Free Tier)
6. Click **Create Web Service**.

### 4. Copy Your Live API URL
Once Render finishes building your container, look at the top left of your dashboard. You will see a live URL (e.g., `https://supplychain-api.onrender.com`). 
**Copy this URL!**

---

## PART 2: Deploying the React Frontend (GitHub Pages)

Now that your backend is alive on the internet, we will tell the frontend to talk to it, compile it, and push it to GitHub Pages.

### 1. Connect the Frontend to the Backend
1. Open your code editor and navigate to the `frontend` folder.
2. Create a new file named exactly `.env.production` in the `frontend` root.
3. Paste the following inside it, replacing the URL with the one you copied from Render:
```env
VITE_API_URL=https://supplychain-api.onrender.com/api
```
*(Make sure to include `/api` at the end!)*

### 2. Configure GitHub Repository Target
1. Open `frontend/package.json`.
2. Add a `"homepage"` key near the top, right below the version. Replace the URL with your exact GitHub username and Repository Name:
```json
{
  "name": "frontend",
  "homepage": "https://<your-username>.github.io/<Your-Repo-Name>",
  "private": true,
  // ... rest of package.json
}
```

### 3. Deploy!
1. Open your terminal inside the `frontend` folder.
2. Run the deployment script:
```bash
npm run deploy
```
*Behind the scenes, this runs Vite's build process (embedding your Render API URL into the code) and pushes the optimized `dist/` folder to a special `gh-pages` branch on your GitHub repository.*

### 4. Enable GitHub Pages
1. Go to your Repository on GitHub.com.
2. Go to **Settings** > **Pages** (on the left sidebar).
3. Under **Build and deployment**, ensure the **Source** is set to `Deploy from a branch`.
4. Ensure the **Branch** dropdown is set to `gh-pages` and `/root`.
5. Click **Save**.

Wait about 2 minutes for GitHub to process the files. At the top of the Pages settings, you will see a link saying *"Your site is live at..."*. Click it!

🎉 **Congratulations! Your Full Stack Supply Chain application is now live on the internet!**
