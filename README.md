# 🩺 DiabetIQ — Diabetes Risk Prediction

A full-stack web application that uses **Machine Learning** to predict diabetes risk based on the **PIMA Indians Diabetes Dataset**. Built with a FastAPI backend and a React (Vite) frontend.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange?logo=scikit-learn)

---

## ✨ Features

| Page | Description |
|------|-------------|
| **Home** | Landing page with hero section, feature highlights, team, and CTA |
| **Predict** | Interactive form for 8 health parameters → instant AI risk assessment |
| **Visualize** | Feature importance charts (bar, pie) & user vs. average comparison (bar, radar) |
| **Data Info** | Paginated, sortable dataset table with summary statistics |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Model** | Gradient Boosting (scikit-learn), StandardScaler, joblib |
| **Backend** | FastAPI, Uvicorn, Pandas, NumPy |
| **Frontend** | React 18 (Vite), Tailwind CSS v4, Recharts, Lucide-React |
| **API Client** | Axios |

## 📂 Project Structure

```
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
│   │   ├── pages/            # Home, Predict, Visualize, DataInfo
│   │   ├── components/       # Navbar, Footer
│   │   ├── api.js            # Axios API client
│   │   ├── App.jsx           # Router setup
│   │   └── index.css         # Design system
│   ├── index.html
│   ├── vite.config.js
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
