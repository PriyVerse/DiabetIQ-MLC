# 🩺 DiabetIQ — Diabetes Risk Prediction

A full-stack web application that uses **Machine Learning** to predict diabetes risk based on the **PIMA Indians Diabetes Dataset**. Built with a FastAPI backend and a premium React (Vite) frontend featuring a modern SaaS aesthetic.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange?logo=scikit-learn)

---

## ✨ Features

- **Premium UI/UX:** Built with Shadcn UI, Tailwind CSS v4, and a fully dynamic Dark/Light mode theme system that persists your preferences. Includes an animated, hardware-accelerated starry background.
- **AI-Powered Predictions:** Instant clinical-grade risk assessments powered by a trained Gradient Boosting model.
- **Visual Insights:** Interactive charts (bar, pie, radar) comparing your metrics against population averages and revealing feature importance.
- **Privacy First:** All health data remains strictly in your browser session.

| Page | Description |
|------|-------------|
| **Home** | Landing page with hero section, feature highlights, team, and CTA |
| **Predict** | Interactive form for 8 health parameters → instant AI risk assessment |
| **Visualize** | Feature importance charts & user vs. average comparison |
| **Data Info** | Paginated, sortable dataset table with summary statistics |

## 👥 Meet the Team

- **Priyanshu Nayak** — Lead Architect + Web Dev 👑
- **Sajal Gupta** — Web Dev 💻
- **Satish Shukla** — Model Design 🧠
- **Kirtiraj Sahu** — Support 🤝
- **Sandeep Mandal** — Support 🤝

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Model** | Gradient Boosting (scikit-learn), StandardScaler, joblib |
| **Backend** | FastAPI, Uvicorn, Pandas, NumPy |
| **Frontend** | React 19 (Vite), Tailwind CSS v4, Shadcn UI, Recharts, Lucide-React, next-themes |
| **API Client** | Axios |

## 📂 Project Structure

```text
MLC 2 prj/
├── diabetes.csv              # PIMA Indians Diabetes Dataset
├── backend/
│   ├── train_model.py        # Train & export ML model
│   ├── main.py               # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   ├── saved_model/          # (generated) model + scaler .pkl files
│   ├── dataset_stats.json    # (generated) stats for frontend
│   └── feature_importance.json # (generated) feature importance
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components (Shadcn), ThemeProvider, StarryBackground
│   │   ├── pages/            # App routes
│   │   ├── api.js            # Axios API client
│   │   ├── App.jsx           # Main layout & router
│   │   └── index.css         # Global design tokens (Dark/Light mode)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── components.json       # Shadcn UI configuration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Train the ML Model
```bash
cd backend
pip install -r requirements.txt
python train_model.py
```

### 2. Start the Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Predict diabetes risk (8 parameters) |
| `GET` | `/stats` | Dataset statistics + sample data |
| `GET` | `/feature-importance` | Model feature importance scores |
| `GET` | `/averages` | Dataset column averages |

## 📊 Model Performance

- **Algorithm**: Gradient Boosting Classifier
- **Accuracy**: ~75%
- **Features**: Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age

## 📝 License

This project is for **educational purposes only**. Not intended for clinical use.
