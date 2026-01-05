import express from "express";
import { predictJobRole, getJobInsights, getPredictionHistory, submitFeedback, testPredictionSave, debugGetPredictions } from "../controllers/prediction.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/predict-job", isAuthenticated, predictJobRole);
router.get("/insights", isAuthenticated, getJobInsights);
router.get("/history", isAuthenticated, getPredictionHistory);
router.post("/feedback/:predictionId", isAuthenticated, submitFeedback);

// Debug routes
router.post("/test-save", testPredictionSave);
router.get("/debug", debugGetPredictions);

export default router;