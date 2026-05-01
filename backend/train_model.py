"""
Train a Gradient Boosting Classifier on the PIMA Indians Diabetes Dataset.
Handles missing values (zeros) via median imputation, scales features,
and exports the trained model + scaler via joblib.
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# ── Load dataset ──────────────────────────────────────────────────────────────
# Try multiple paths: parent dir (local dev) and current dir (Render deploy)
_base = os.path.dirname(os.path.abspath(__file__))
_candidates = [
    os.path.join(_base, "..", "diabetes.csv"),   # local dev (repo root)
    os.path.join(_base, "diabetes.csv"),          # if copied into backend/
    "diabetes.csv",                               # current working dir
]
DATA_PATH = None
for _p in _candidates:
    if os.path.isfile(_p):
        DATA_PATH = _p
        break
if DATA_PATH is None:
    raise FileNotFoundError(
        f"diabetes.csv not found. Searched: {_candidates}"
    )
print(f"Using dataset: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")
print(f"Outcome distribution:\n{df['Outcome'].value_counts()}\n")

# ── Handle missing values (zeros that are biologically impossible) ─────────
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
for col in zero_cols:
    df[col] = df[col].replace(0, np.nan)
    median_val = df[col].median()
    df[col] = df[col].fillna(median_val)
    print(f"  {col}: replaced zeros with median = {median_val:.2f}")

# ── Compute & save dataset statistics for frontend ────────────────────────
feature_cols = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

stats = {}
for col in feature_cols:
    stats[col] = {
        "mean": round(float(df[col].mean()), 2),
        "median": round(float(df[col].median()), 2),
        "std": round(float(df[col].std()), 2),
        "min": round(float(df[col].min()), 2),
        "max": round(float(df[col].max()), 2),
    }

# Save a sample of data for the frontend Data Info page
sample_data = df.head(100).to_dict(orient="records")

import json
stats_path = os.path.join(os.path.dirname(__file__), "dataset_stats.json")
with open(stats_path, "w") as f:
    json.dump({"stats": stats, "sample": sample_data}, f, indent=2)
print(f"\nDataset stats saved to {stats_path}")

# ── Prepare features & target ─────────────────────────────────────────────
X = df[feature_cols].values
y = df["Outcome"].values

# ── Split ─────────────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Scale ─────────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ── Train Gradient Boosting ──────────────────────────────────────────────
model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=4,
    min_samples_split=5,
    min_samples_leaf=3,
    subsample=0.8,
    random_state=42,
)
model.fit(X_train_scaled, y_train)

# ── Evaluate ──────────────────────────────────────────────────────────────
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n{'='*50}")
print(f"  Model Accuracy: {accuracy:.4f}")
print(f"{'='*50}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["No Diabetes", "Diabetes"]))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ── Feature importance ────────────────────────────────────────────────────
importances = model.feature_importances_
feature_importance = {
    col: round(float(imp), 4) for col, imp in zip(feature_cols, importances)
}
print("\nFeature Importances:")
for feat, imp in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
    print(f"  {feat}: {imp:.4f}")

# Save feature importance
importance_path = os.path.join(os.path.dirname(__file__), "feature_importance.json")
with open(importance_path, "w") as f:
    json.dump(feature_importance, f, indent=2)

# ── Export model & scaler ─────────────────────────────────────────────────
model_dir = os.path.join(os.path.dirname(__file__), "saved_model")
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, "diabetes_model.pkl"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))
print(f"\nModel and scaler saved to {model_dir}/")
