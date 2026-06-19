# Render Backend Deployment Guide

Your Java Backend is fully prepared for Cloud Deployment! We have containerized the application and added the necessary environment configurations.

## 1. What was modified
- **Dynamic PORT**: `Main.java` now uses `System.getenv("PORT")` so Render can dynamically assign external HTTP ports.
- **Configurable Storage**: `FileManager.java` uses the `STORAGE_PATH` environment variable. By default, it falls back to your local `data/` folder, but on Render, it will use the Docker persistent disk.
- **Health Endpoint**: Added `GET /api/health` so Render can verify your API is running and not crash the deployment.
- **Dockerization**: Generated a `.dockerignore` and a `Dockerfile` using an Alpine Linux Java 21 image for minimal memory footprint.

## 2. Pushing to GitHub
Commit all the files I've modified (`Main.java`, `FileManager.java`, `ApiServer.java`, `SystemHandler.java`, `Dockerfile`, `.dockerignore`) and push them to your repository:
```bash
git add .
git commit -m "Deploy: Prepared Backend for Render"
git push
```

## 3. Deploying to Render

1. Create a free account at [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect the `Dockerfile` and configure a Docker environment.
5. In the **Settings** section during creation, scroll down to **Advanced** and click **Add Disk**:
   - **Name**: `supply-chain-data`
   - **Mount Path**: `/app/persistent_data`
   - **Size**: 1GB (Free tier)
6. Click **Create Web Service**.

> [!IMPORTANT]
> Because you attached a Disk to `/app/persistent_data`, your `STORAGE_PATH` environment variable defined in the Dockerfile will correctly save `users.txt` and `orders.txt` inside the persistent volume. Your data will **never be deleted** when the container restarts!

## 4. Connecting your Frontend
Once Render finishes building your container, it will give you a URL like `https://supplychain-api.onrender.com`.

Go to your React project, find `frontend/src/services/api.js`, and replace the `baseURL`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://supplychain-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

You are now live!
