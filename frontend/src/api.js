import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const predictDiabetes = (data) => API.post("/predict", data);
export const smartPredict = (data) => API.post("/predict/smart", data);
export const getStats = () => API.get("/stats");
export const getFeatureImportance = () => API.get("/feature-importance");
export const getAverages = () => API.get("/averages");

export default API;
