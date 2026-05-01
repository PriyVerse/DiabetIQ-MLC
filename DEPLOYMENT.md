# 🚀 Deployment Guide: DiabetIQ

## **Prerequisites**

- A GitHub account with the repo pushed to `PriyVerse/DiabetIQ-MLC`
- Free accounts on [Render](https://render.com) and [Vercel](https://vercel.com)

---

## **Part 1: Deploy Backend to Render**

### Step 1.1: Prepare Your Repository

Make sure all required files are committed (model files, dataset, stats JSON files):

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 1.2: Deploy on Render

1. Go to **https://render.com** and sign up/log in (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select `PriyVerse/DiabetIQ-MLC`
4. Fill in the form:
   - **Name:** `diabetiq-backend`
   - **Environment:** Python 3
   - **Build Command:**
     ```
     cd backend && pip install -r requirements.txt && cp ../diabetes.csv . && python train_model.py
     ```
   - **Start Command:**
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan:** Free
5. Click **"Create Web Service"**
6. Wait 3-5 minutes for deployment. You'll get a URL like: `https://diabetiq-backend.onrender.com`

### Step 1.3: Verify Backend

Open your browser and go to your Render URL (e.g., `https://diabetiq-backend.onrender.com`).
You should see:
```json
{"message": "Diabetes Risk Prediction API is running", "version": "1.0.0"}
```

### Step 1.4: Copy Your Backend URL

Save it — you'll need it for the frontend. Example: `https://diabetiq-backend.onrender.com`

---

## **Part 2: Deploy Frontend to Vercel**

### Step 2.1: Deploy on Vercel

1. Go to **https://vercel.com** and sign up/log in (free)
2. Click **"Add New Project"**
3. Import your `PriyVerse/DiabetIQ-MLC` repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Add Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://diabetiq-backend.onrender.com` *(your actual Render URL)*
6. Click **"Deploy"**
7. Wait 2-3 minutes. Your frontend URL will be something like: `https://diabetiq-mlc.vercel.app`

> **Important:** The `VITE_API_URL` environment variable MUST be set in Vercel's dashboard,
> not just in the `.env.production` file. Vercel bakes env vars into the build at deploy time.

---

## **Part 3: Verify Deployment**

1. Open your Vercel frontend URL
2. Navigate to the **Predict** page
3. Fill in test values and click **"Predict My Risk"**
4. If you see a prediction result → ✅ Everything works!

**Test values you can use:**
| Parameter | Value |
|-----------|-------|
| Pregnancies | 2 |
| Glucose | 120 |
| Blood Pressure | 72 |
| Skin Thickness | 29 |
| Insulin | 125 |
| BMI | 32.0 |
| Diabetes Pedigree | 0.627 |
| Age | 35 |

---

## **Common Issues & Fixes**

| Issue | Solution |
|-------|----------|
| **Frontend can't connect to backend** | Ensure `VITE_API_URL` is set in Vercel dashboard → Settings → Environment Variables. Redeploy after adding it. |
| **503 error on Render** | Free tier spins down after 15 min of inactivity. First request takes ~30s to wake up. Just wait and refresh. |
| **CORS errors in browser** | Already configured in `main.py` with `allow_origins=["*"]`. Check browser console for the exact error. |
| **Model files not found on Render** | The build command runs `train_model.py` which regenerates them. Check Render build logs. |
| **Build fails: "diabetes.csv not found"** | Make sure `diabetes.csv` is committed to git (not gitignored). The build copies it into the backend folder. |
| **Vercel build fails** | Ensure root directory is set to `frontend` in Vercel project settings. |

---

## **Monitoring & Updating**

- **Render Logs:** Dashboard → Select service → Logs tab
- **Vercel Logs:** Dashboard → Select project → Deployments tab
- **Auto-deploy:** Both platforms auto-deploy when you push to `main` branch

---

## **Optional: Custom Domain**

- Render: https://render.com/docs/custom-domains
- Vercel: https://vercel.com/docs/concepts/projects/domains

---

## **Architecture**

```
┌─────────────┐          ┌──────────────────┐
│   Vercel     │  HTTPS   │     Render       │
│  (Frontend)  │ ──────── │    (Backend)     │
│  React+Vite  │  API     │  FastAPI+ML      │
│  Static SPA  │  calls   │  Python 3.11     │
└─────────────┘          └──────────────────┘
```

Enjoy! 🎉
