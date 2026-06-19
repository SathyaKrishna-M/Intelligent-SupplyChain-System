# Deployment Guide: React Frontend & Java Backend

You've built an incredible application, and deploying it is the final step! However, there is a fundamental rule of web deployment we need to address:

> [!WARNING]
> **GitHub Pages cannot host your backend.**
> GitHub Pages is exclusively a "Static Site Host." It is perfect for hosting your React frontend (HTML, CSS, JS), but it **cannot run server-side code** like your Java `Main` API server.

To get this project live on the internet, we must split the deployment into two parts:
1. **Frontend**: Deployed to GitHub Pages (Free).
2. **Backend**: Deployed to a Cloud Provider like Render or Railway (Free Tier available).

---

## Step 1: Prepare the Frontend to Connect Dynamically

Right now, your frontend is hardcoded to look for the backend on your local computer. We need to tell React to use the cloud backend when it's deployed.

**Update `frontend/src/services/api.js`:**
```javascript
import axios from 'axios';

// Dynamically choose the backend URL
const isProduction = import.meta.env.MODE === 'production';
const API_URL = isProduction 
  ? 'https://your-cloud-backend-url.onrender.com/api' // We will get this in Step 2
  : 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Step 2: Deploy the Java Backend (Render)

Since your backend is a custom Java `HttpServer` that reads local `.txt` files for its database, the easiest way to deploy it for free is using **Render.com** combined with a `Dockerfile`.

1. Create a `Dockerfile` in the root of your `SupplyChain` folder:
```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . .
# Compile the Java application
RUN cd src && javac -d ../bin **/*.java *.java
# Run the application
CMD ["java", "-cp", "bin", "Main"]
```
2. Push your code to GitHub.
3. Go to [Render.com](https://render.com), create a free account, and select **New Web Service**.
4. Connect your GitHub repository. Render will automatically detect the `Dockerfile` and boot up your Java server on the cloud!
5. Render will give you a live URL (e.g., `https://supply-chain-api.onrender.com`). Copy this and paste it into your `api.js` from Step 1.

---

## Step 3: Deploy the Frontend (GitHub Pages)

Now that your backend is alive on the internet, let's push the React UI to GitHub Pages.

1. **Install `gh-pages`**: Run this command inside your `frontend` folder:
```bash
npm install gh-pages --save-dev
```

2. **Update `vite.config.js`**: Add the base path for your GitHub repository.
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/Your-Repo-Name/', // Replace with your exact GitHub repo name!
})
```

3. **Update `package.json`**: Add the deploy scripts and homepage link.
```json
{
  "homepage": "https://<your-github-username>.github.io/<Your-Repo-Name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

4. **Deploy it!**
Run this command in your terminal:
```bash
npm run deploy
```
This will bundle your React app and push it directly to your GitHub Pages URL!

---

## Summary
By keeping your Frontend on GitHub Pages and your Backend on Render, you get a fully functional, live SaaS application for zero dollars. 

Let me know if you want me to write the `Dockerfile` or modify the `api.js` for you right now so it's perfectly ready for your deployment!
