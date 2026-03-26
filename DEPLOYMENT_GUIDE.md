# Seleste Deployment Guide

The Seleste architecture is fully decoupled, meaning the frontend React (Vite) SPA and backend Node.js (Express) api are deployed as separate services.

## 1. Backend API (Render)
Render is perfect for our Express Node.js backend. A `render.yaml` file has been provided in the root directory to automate this.

1. Create a free account at [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Go to **Blueprints** -> **New Blueprint Instance** and select your repository. Render will automatically detect the `render.yaml` file and create the `seleste-backend` web service.
4. During setup, Render will ask you to provide the required environment variables:
   - `DATABASE_URL` (Your Supabase connection string)
   - `CLERK_SECRET_KEY` (From your Clerk dashboard)
   - `ANTHROPIC_API_KEY` (Your Claude API key)
5. Once deployed, note down your production backend URL (e.g., `https://seleste-backend.onrender.com`).

## 2. Frontend React App (Vercel)
Vercel is incredible for hosting static single-page applications like our Vite build.

1. Create a free account at [Vercel.com](https://vercel.com).
2. Add a **New Project** and import your GitHub repository.
3. **Crucial:** In the "Framework Preset" select **Vite**. 
4. **Crucial:** Set the **Root Directory** to `frontend`.
5. Under **Environment Variables**, you must add:
   - `VITE_API_URL`: Set this to your Render backend URL (e.g., `https://seleste-backend.onrender.com`).
   - `VITE_CLERK_PUBLISHABLE_KEY`: From your Clerk API Keys dashboard.
6. Click **Deploy**.

## Routing Architecture
In local development, the Vite server proxies `/api` calls to your local backend. In production on Vercel, the `VITE_API_URL` environment variable is used to prefix all endpoints so the static frontend reaches out specifically to your Render url securely!
