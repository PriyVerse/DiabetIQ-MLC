# 🚀 Deployment Guide: DiabetIQ

## **Part 1: Deploy Backend to Render**

### Step 1.1: Prepare Your GitHub Repository
```bash
git add .
git commit -m "Add Procfile and prepare for deployment"
git push
```

### Step 1.2: Deploy on Render
1. Go to https://render.com and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select `PriyVerse/DiabetIQ-MLC`
4. Fill in the form:
   - **Name:** `diabetiq-backend` (or your choice)
   - **Environment:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **"Create Web Service"**
6. Wait 3-5 minutes for deployment. You'll get a URL like: `https://diabetiq-backend.onrender.com`

### Step 1.3: Note Your Backend URL
Copy the URL from Render (e.g., `https://diabetiq-backend.onrender.com`)

---

## **Part 2: Deploy Frontend to Vercel**

### Step 2.1: Create Environment File
Create `.env.production` in the `frontend/` folder:
```
VITE_API_URL=https://diabetiq-backend.onrender.com
```
(Replace with your actual Render URL)

### Step 2.2: Deploy on Vercel
1. Go to https://vercel.com and sign up (free)
2. Click **"Add New Project"**
3. Select your `PriyVerse/DiabetIQ-MLC` repository
4. Fill in the configuration:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   - Add: `VITE_API_URL` = `https://diabetiq-backend.onrender.com`
6. Click **"Deploy"**
7. Wait 2-3 minutes. Your frontend URL will be something like: `https://diabetiq-mlc.vercel.app`

---

## **Part 3: Verify Deployment**

1. Open your Vercel frontend URL
2. Navigate to the **Predict** page
3. Fill in test values and click "Predict"
4. If you see a prediction result → ✅ Everything works!

---

## **Common Issues & Fixes**

| Issue | Solution |
|-------|----------|
| Frontend can't connect to backend | Make sure `VITE_API_URL` env var is set in Vercel |
| 503 error on Render backend | Free tier may need a minute to wake up. Refresh. |
| CORS errors | Already configured in `main.py`, but check browser console |
| Model files not found | Ensure `saved_model/` folder is committed to git |

---

## **Monitoring & Updating**

- **Render Logs:** https://dashboard.render.com → Select your service → Logs
- **Vercel Logs:** https://vercel.com/dashboard → Select project → Deployments
- **Auto-deploy:** Both platforms auto-deploy when you push to `main` branch

---

## **Optional: Custom Domain**

- Render: https://render.com/docs/custom-domains
- Vercel: https://vercel.com/docs/concepts/projects/domains

Enjoy! 🎉
