"""
FastAPI backend for Diabetes Risk Prediction.
Serves prediction endpoint + dataset stats + feature importance.
Includes smart prediction endpoint with user-friendly input mapping.
"""

import os
import json
import math
import numpy as np
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

# ── App setup ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Diabetes Risk Prediction API",
    description="Predict diabetes risk using the PIMA Indians Diabetes Dataset model",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model & scaler ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "saved_model", "diabetes_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "saved_model", "scaler.pkl")
STATS_PATH = os.path.join(BASE_DIR, "dataset_stats.json")
IMPORTANCE_PATH = os.path.join(BASE_DIR, "feature_importance.json")

# Auto-generate missing artifacts by running train_model.py
required_files = [MODEL_PATH, SCALER_PATH, STATS_PATH, IMPORTANCE_PATH]
if not all(os.path.isfile(f) for f in required_files):
    print("⚠️  Some model artifacts are missing. Running train_model.py ...")
    import subprocess
    result = subprocess.run(
        ["python", os.path.join(BASE_DIR, "train_model.py")],
        cwd=BASE_DIR,
        capture_output=True,
        text=True,
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"❌ train_model.py failed:\n{result.stderr}")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

with open(STATS_PATH, "r") as f:
    dataset_info = json.load(f)

with open(IMPORTANCE_PATH, "r") as f:
    feature_importance = json.load(f)

# ── Dataset medians (fallback values for missing inputs) ──────────────────
DATASET_MEDIANS = {col: info["median"] for col, info in dataset_info["stats"].items()}


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


class SmartPredictionInput(BaseModel):
    """User-friendly input that gets mapped to ML model features."""
    # ── Required basics ──
    age: int = Field(..., ge=1, le=120, description="Age in years")
    gender: str = Field(..., description="'male' or 'female'")

    # ── Body metrics ──
    height_cm: float = Field(..., ge=50, le=250, description="Height in centimeters")
    weight_kg: float = Field(..., ge=20, le=300, description="Weight in kilograms")

    # ── Health profile (beginner-friendly) ──
    bp_category: str = Field(
        default="dont_know",
        description="Blood pressure category: 'normal', 'sometimes_high', 'diagnosed_high', 'dont_know'",
    )
    family_history: str = Field(
        default="none",
        description="Family history: 'none', 'grandparent', 'parent_or_sibling', 'multiple_close'",
    )
    activity_level: str = Field(
        default="moderate",
        description="Activity level: 'sedentary', 'light', 'moderate', 'active', 'very_active'",
    )

    # ── Conditional ──
    pregnancies: Optional[int] = Field(
        default=None, ge=0, le=20,
        description="Number of pregnancies (only for female users)",
    )

    # ── Symptoms (lifestyle signals) ──
    symptoms: Optional[List[str]] = Field(
        default=None,
        description="List of symptom keys: 'frequent_thirst', 'frequent_urination', 'fatigue', 'blurred_vision', 'slow_healing', 'numbness', 'none'",
    )

    # ── Optional advanced lab values ──
    glucose: Optional[float] = Field(default=None, ge=0, le=500, description="Plasma glucose (mg/dL)")
    insulin: Optional[float] = Field(default=None, ge=0, le=900, description="2-hr serum insulin (mu U/ml)")
    blood_pressure_exact: Optional[float] = Field(default=None, ge=0, le=200, description="Exact diastolic BP (mm Hg)")
    skin_thickness: Optional[float] = Field(default=None, ge=0, le=100, description="Triceps skinfold (mm)")
    diabetes_pedigree: Optional[float] = Field(default=None, ge=0, le=3, description="Pedigree function value")


class ContributingFactor(BaseModel):
    feature: str
    label: str
    value: float
    status: str  # 'normal', 'elevated', 'high', 'low'
    impact: str  # 'low', 'medium', 'high'
    description: str


class HealthInsight(BaseModel):
    icon: str
    title: str
    description: str
    type: str  # 'positive', 'warning', 'info'


class SmartPredictionResult(BaseModel):
    prediction: int
    risk_label: str
    risk_level: str  # 'low', 'moderate', 'high', 'very_high'
    probability: float
    confidence: float
    mode: str  # 'quick' or 'advanced'
    data_completeness: float  # 0-100, how much data was provided vs imputed
    bmi_calculated: float
    contributing_factors: List[ContributingFactor]
    health_insights: List[HealthInsight]
    recommendations: List[str]
    model_features_used: dict


# ── Mapping helpers ───────────────────────────────────────────────────────

BP_CATEGORY_MAP = {
    "normal": 72.0,
    "sometimes_high": 85.0,
    "diagnosed_high": 95.0,
    "dont_know": DATASET_MEDIANS.get("BloodPressure", 72.0),
}

FAMILY_HISTORY_MAP = {
    "none": 0.17,
    "grandparent": 0.35,
    "parent_or_sibling": 0.73,
    "multiple_close": 1.20,
}

# Activity level adjusts glucose estimation slightly
ACTIVITY_GLUCOSE_OFFSET = {
    "sedentary": 12.0,
    "light": 5.0,
    "moderate": 0.0,
    "active": -5.0,
    "very_active": -10.0,
}

# Symptom presence can shift glucose estimation
SYMPTOM_GLUCOSE_BOOST = {
    "frequent_thirst": 8.0,
    "frequent_urination": 8.0,
    "fatigue": 4.0,
    "blurred_vision": 6.0,
    "slow_healing": 5.0,
    "numbness": 3.0,
    "none": 0.0,
}


def compute_bmi(height_cm: float, weight_kg: float) -> float:
    """Calculate BMI from height (cm) and weight (kg)."""
    height_m = height_cm / 100.0
    if height_m <= 0:
        return DATASET_MEDIANS.get("BMI", 32.0)
    return round(weight_kg / (height_m ** 2), 1)


def estimate_glucose(activity_level: str, symptoms: list, age: int) -> float:
    """Estimate glucose when lab value is not provided."""
    base = DATASET_MEDIANS.get("Glucose", 117.0)

    # Activity adjustment
    base += ACTIVITY_GLUCOSE_OFFSET.get(activity_level, 0.0)

    # Symptom boost
    if symptoms:
        symptom_boost = sum(SYMPTOM_GLUCOSE_BOOST.get(s, 0.0) for s in symptoms)
        base += min(symptom_boost, 25.0)  # cap at +25

    # Age factor (older → slightly higher baseline)
    if age > 45:
        base += (age - 45) * 0.5

    return round(min(max(base, 50.0), 250.0), 1)


def get_risk_level(probability: float) -> str:
    """Classify risk into human-readable levels."""
    if probability < 25:
        return "low"
    elif probability < 50:
        return "moderate"
    elif probability < 75:
        return "high"
    else:
        return "very_high"


def get_feature_status(feature: str, value: float) -> tuple:
    """Return (status, description) for a given feature value."""
    ranges = {
        "BMI": {
            "thresholds": [18.5, 25, 30],
            "labels": ["underweight", "normal", "elevated", "high"],
            "descriptions": [
                "Your BMI is below normal range",
                "Your BMI is within healthy range",
                "Your BMI indicates overweight",
                "Your BMI indicates obesity",
            ],
        },
        "Glucose": {
            "thresholds": [100, 126],
            "labels": ["normal", "elevated", "high"],
            "descriptions": [
                "Blood sugar appears normal",
                "Blood sugar is in pre-diabetic range",
                "Blood sugar is in diabetic range",
            ],
        },
        "BloodPressure": {
            "thresholds": [80, 90],
            "labels": ["normal", "elevated", "high"],
            "descriptions": [
                "Blood pressure is normal",
                "Blood pressure is slightly elevated",
                "Blood pressure is high",
            ],
        },
        "Age": {
            "thresholds": [30, 45, 60],
            "labels": ["low", "normal", "elevated", "high"],
            "descriptions": [
                "Age is a low risk factor",
                "Age is a moderate factor",
                "Age increases risk moderately",
                "Age is a significant risk factor",
            ],
        },
        "DiabetesPedigreeFunction": {
            "thresholds": [0.3, 0.7, 1.2],
            "labels": ["low", "normal", "elevated", "high"],
            "descriptions": [
                "Low genetic predisposition",
                "Moderate family history influence",
                "Notable family history of diabetes",
                "Strong family history of diabetes",
            ],
        },
    }

    info = ranges.get(feature)
    if not info:
        return "normal", "Within expected range"

    idx = 0
    for t in info["thresholds"]:
        if value >= t:
            idx += 1
        else:
            break

    return info["labels"][min(idx, len(info["labels"]) - 1)], info["descriptions"][min(idx, len(info["descriptions"]) - 1)]


def build_health_insights(data: SmartPredictionInput, bmi: float, probability: float) -> list:
    """Generate contextual health insights based on the input data."""
    insights = []

    # BMI insight
    if bmi < 18.5:
        insights.append(HealthInsight(icon="⚖️", title="Underweight", description="Your BMI suggests you're underweight. Maintaining a healthy weight supports metabolic health.", type="warning"))
    elif bmi < 25:
        insights.append(HealthInsight(icon="✅", title="Healthy Weight", description="Your BMI is in the healthy range. Keep maintaining your current lifestyle.", type="positive"))
    elif bmi < 30:
        insights.append(HealthInsight(icon="⚠️", title="Overweight", description="Your BMI indicates overweight. Even modest weight loss (5-7%) can significantly reduce diabetes risk.", type="warning"))
    else:
        insights.append(HealthInsight(icon="🔴", title="Obesity Range", description="Your BMI is in the obese range. Weight management is one of the most effective ways to reduce diabetes risk.", type="warning"))

    # Activity insight
    if data.activity_level in ("sedentary", "light"):
        insights.append(HealthInsight(icon="🏃", title="Activity Matters", description="Increasing physical activity to 150 min/week can reduce diabetes risk by up to 58%.", type="info"))
    elif data.activity_level in ("active", "very_active"):
        insights.append(HealthInsight(icon="💪", title="Active Lifestyle", description="Your activity level is excellent. Regular exercise improves insulin sensitivity.", type="positive"))

    # Family history insight
    if data.family_history in ("parent_or_sibling", "multiple_close"):
        insights.append(HealthInsight(icon="🧬", title="Family History", description="Having close relatives with diabetes increases your risk. Regular screening is recommended.", type="warning"))

    # Age insight
    if data.age > 45:
        insights.append(HealthInsight(icon="📅", title="Age Factor", description="Risk of Type 2 diabetes increases after age 45. Annual screening is recommended.", type="info"))

    # Symptom insights
    if data.symptoms and "none" not in data.symptoms and len(data.symptoms) > 0:
        count = len(data.symptoms)
        if count >= 3:
            insights.append(HealthInsight(icon="🩺", title="Multiple Symptoms", description=f"You reported {count} symptoms associated with diabetes. Please consult a healthcare professional.", type="warning"))
        else:
            insights.append(HealthInsight(icon="📋", title="Symptoms Noted", description="The symptoms you reported are common but worth discussing with your doctor.", type="info"))

    return insights


def build_recommendations(probability: float, bmi: float, activity_level: str, family_history: str) -> list:
    """Generate actionable recommendations based on risk profile."""
    recs = []

    if probability >= 50:
        recs.append("Schedule a fasting blood glucose test with your healthcare provider")
        recs.append("Consider an HbA1c test for a comprehensive picture of your blood sugar levels")

    if bmi >= 25:
        recs.append("Work toward a 5-7% reduction in body weight through diet and exercise")

    if activity_level in ("sedentary", "light"):
        recs.append("Aim for at least 150 minutes of moderate exercise per week (e.g., brisk walking)")

    if family_history in ("parent_or_sibling", "multiple_close"):
        recs.append("With your family history, get screened annually even if results are normal")

    recs.append("Maintain a balanced diet rich in whole grains, vegetables, and lean proteins")
    recs.append("Monitor your blood pressure and cholesterol levels regularly")

    if probability < 30:
        recs.append("Continue your healthy habits — prevention is the best medicine")

    return recs[:6]  # Cap at 6 recommendations


# ── Endpoints ─────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Diabetes Risk Prediction API is running", "version": "2.0.0"}


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


@app.post("/predict/smart", response_model=SmartPredictionResult)
def predict_smart(data: SmartPredictionInput):
    """
    Smart prediction endpoint.
    Accepts user-friendly inputs and maps them to the 8 ML model features.
    Supports both quick screening and advanced mode with optional lab values.
    """
    # ── Track which features were directly provided vs imputed ──
    provided_count = 0
    total_features = 8

    # 1. Pregnancies
    if data.gender == "male":
        pregnancies = 0.0
        provided_count += 1
    else:
        pregnancies = float(data.pregnancies if data.pregnancies is not None else 0)
        provided_count += 1

    # 2. Glucose
    if data.glucose is not None:
        glucose = float(data.glucose)
        provided_count += 1
    else:
        glucose = estimate_glucose(data.activity_level, data.symptoms or [], data.age)

    # 3. Blood Pressure
    if data.blood_pressure_exact is not None:
        blood_pressure = float(data.blood_pressure_exact)
        provided_count += 1
    else:
        blood_pressure = BP_CATEGORY_MAP.get(data.bp_category, 72.0)

    # 4. Skin Thickness
    if data.skin_thickness is not None:
        skin_thickness = float(data.skin_thickness)
        provided_count += 1
    else:
        skin_thickness = DATASET_MEDIANS.get("SkinThickness", 29.0)

    # 5. Insulin
    if data.insulin is not None:
        insulin = float(data.insulin)
        provided_count += 1
    else:
        insulin = DATASET_MEDIANS.get("Insulin", 125.0)

    # 6. BMI (always calculated from height + weight)
    bmi = compute_bmi(data.height_cm, data.weight_kg)
    provided_count += 1

    # 7. Diabetes Pedigree Function
    if data.diabetes_pedigree is not None:
        pedigree = float(data.diabetes_pedigree)
        provided_count += 1
    else:
        pedigree = FAMILY_HISTORY_MAP.get(data.family_history, 0.35)

    # 8. Age
    age = float(data.age)
    provided_count += 1

    data_completeness = round((provided_count / total_features) * 100, 0)

    # Determine mode
    has_lab = any([
        data.glucose is not None,
        data.insulin is not None,
        data.blood_pressure_exact is not None,
        data.skin_thickness is not None,
        data.diabetes_pedigree is not None,
    ])
    mode = "advanced" if has_lab else "quick"

    # ── Run prediction ──
    features = np.array([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, pedigree, age]])
    features_scaled = scaler.transform(features)
    prediction = int(model.predict(features_scaled)[0])
    probabilities = model.predict_proba(features_scaled)[0]

    risk_prob = round(float(probabilities[1]) * 100, 2)
    confidence = round(float(max(probabilities)) * 100, 2)

    risk_level = get_risk_level(risk_prob)

    # ── Build contributing factors ──
    feature_names = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]
    feature_values = [pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, pedigree, age]
    feature_labels = {
        "Pregnancies": "Pregnancies",
        "Glucose": "Blood Sugar",
        "BloodPressure": "Blood Pressure",
        "SkinThickness": "Skin Thickness",
        "Insulin": "Insulin Level",
        "BMI": "Body Mass Index",
        "DiabetesPedigreeFunction": "Family History Score",
        "Age": "Age",
    }

    # Get model feature importances
    importances = feature_importance

    contributing_factors = []
    for fname, fval in zip(feature_names, feature_values):
        status, desc = get_feature_status(fname, fval)
        imp_score = importances.get(fname, 0.05)
        impact = "high" if imp_score > 0.15 else ("medium" if imp_score > 0.08 else "low")

        contributing_factors.append(ContributingFactor(
            feature=fname,
            label=feature_labels.get(fname, fname),
            value=round(fval, 2),
            status=status,
            impact=impact,
            description=desc,
        ))

    # Sort by impact (high first)
    impact_order = {"high": 0, "medium": 1, "low": 2}
    contributing_factors.sort(key=lambda f: impact_order.get(f.impact, 3))

    # ── Build insights ──
    health_insights = build_health_insights(data, bmi, risk_prob)

    # ── Build recommendations ──
    recommendations = build_recommendations(risk_prob, bmi, data.activity_level, data.family_history)

    # ── Risk label ──
    risk_labels = {
        "low": "Low Risk",
        "moderate": "Moderate Risk",
        "high": "High Risk",
        "very_high": "Very High Risk",
    }

    return SmartPredictionResult(
        prediction=prediction,
        risk_label=risk_labels.get(risk_level, "Unknown"),
        risk_level=risk_level,
        probability=risk_prob,
        confidence=confidence,
        mode=mode,
        data_completeness=data_completeness,
        bmi_calculated=bmi,
        contributing_factors=contributing_factors,
        health_insights=health_insights,
        recommendations=recommendations,
        model_features_used={
            "Pregnancies": pregnancies,
            "Glucose": glucose,
            "BloodPressure": blood_pressure,
            "SkinThickness": skin_thickness,
            "Insulin": insulin,
            "BMI": bmi,
            "DiabetesPedigreeFunction": pedigree,
            "Age": age,
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
