import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllPredictions,
  getUserDetails,
  testJobPredictions
} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/dashboard", isAuthenticated, isAdmin, getDashboardStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/predictions", getAllPredictions);
router.get("/test-predictions", testJobPredictions);
router.get("/test", (req, res) => res.json({ success: true, message: "Admin route works" }));
router.get("/users/:userId", isAuthenticated, isAdmin, getUserDetails);

export default router;