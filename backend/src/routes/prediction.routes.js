import express from "express";
import { predictJobRole, getJobInsights } from "../controllers/prediction.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/predict-job", isAuthenticated, predictJobRole);
router.get("/insights", isAuthenticated, getJobInsights);

export default router;