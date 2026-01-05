import express from "express";
import { predictJobRole, getJobInsights, getPredictionHistory } from "../controllers/prediction.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/predict-job", isAuthenticated, predictJobRole);
router.get("/insights", isAuthenticated, getJobInsights);
router.get("/history", isAuthenticated, getPredictionHistory);

export default router;