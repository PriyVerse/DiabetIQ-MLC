"""
FastAPI backend for Diabetes Risk Prediction.
Serves prediction endpoint + dataset stats + feature importance.
"""

import os
import json
import numpy as np
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ── App setup ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Diabetes Risk Prediction API",
    description="Predict diabetes risk using the PIMA Indians Diabetes Dataset model",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model & scaler ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "saved_model", "diabetes_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "saved_model", "scaler.pkl")
STATS_PATH = os.path.join(BASE_DIR, "dataset_stats.json")
IMPORTANCE_PATH = os.path.join(BASE_DIR, "feature_importance.json")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

with open(STATS_PATH, "r") as f:
    dataset_info = json.load(f)

with open(IMPORTANCE_PATH, "r") as f:
    feature_importance = json.load(f)


# ── Request / Response schemas ────────────────────────────────────────────
class PredictionInput(BaseModel):
    pregnancies: float = Field(..., ge=0, description="Number of pregnancies")
    glucose: float = Field(..., ge=0, description="Plasma glucose concentration (mg/dL)")
    blood_pressure: float = Field(..., ge=0, description="Diastolic blood pressure (mm Hg)")
    skin_thickness: float = Field(..., ge=0, description="Triceps skinfold thickness (mm)")
    insulin: float = Field(..., ge=0, description="2-Hour serum insulin (mu U/ml)")
    bmi: float = Field(..., ge=0, description="Body mass index (kg/m²)")
    diabetes_pedigree: float = Field(..., ge=0, description="Diabetes pedigree function")
    age: float = Field(..., ge=1, description="Age in years")


class PredictionResult(BaseModel):
    prediction: int
    risk_label: str
    probability: float
    confidence: float
    input_values: dict


# ── Endpoints ─────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Diabetes Risk Prediction API is running", "version": "1.0.0"}


@app.post("/predict", response_model=PredictionResult)
def predict(data: PredictionInput):
    """Accept 8 health parameters, return prediction + probability."""
    features = np.array([
        [
            data.pregnancies,
            data.glucose,
            data.blood_pressure,
            data.skin_thickness,
            data.insulin,
            data.bmi,
            data.diabetes_pedigree,
            data.age,
        ]
    ])

    features_scaled = scaler.transform(features)
    prediction = int(model.predict(features_scaled)[0])
    probabilities = model.predict_proba(features_scaled)[0]

    risk_prob = float(probabilities[1])
    confidence = float(max(probabilities))

    return PredictionResult(
        prediction=prediction,
        risk_label="High Risk" if prediction == 1 else "Low Risk",
        probability=round(risk_prob * 100, 2),
        confidence=round(confidence * 100, 2),
        input_values={
            "Pregnancies": data.pregnancies,
            "Glucose": data.glucose,
            "BloodPressure": data.blood_pressure,
            "SkinThickness": data.skin_thickness,
            "Insulin": data.insulin,
            "BMI": data.bmi,
            "DiabetesPedigreeFunction": data.diabetes_pedigree,
            "Age": data.age,
        },
    )


@app.get("/stats")
def get_stats():
    """Return dataset statistics and a sample of the data."""
    return dataset_info


@app.get("/feature-importance")
def get_feature_importance():
    """Return feature importance scores from the trained model."""
    return feature_importance


@app.get("/averages")
def get_averages():
    """Return the average values for each feature in the dataset."""
    return {col: info["mean"] for col, info in dataset_info["stats"].items()}
