import express from "express";
import {
  addCertification,
  deleteCertification,
  forgetPassword,
  getUserProfile,
  getUserInfo,
  login,
  logout,
  register,
  resetPassword,
  updateCertification,
  updateSkills,
  updateUserProfile,
  verification,
  verifyOTP,
} from "../controllers/user.controller.js";
import { validation } from "../middlewares/validation.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  certifications,
  CGPA,
  collage,
  degree,
  email,
  name,
  newPassword,
  otp,
  password,
  skills,
  yearOfPassing,
} from "../middlewares/expressValidator.js";

const router = express.Router();

router.post("/register", [name, email, password], validation, register);
router.post(
  "/verification",
  [degree, yearOfPassing, skills, CGPA, certifications, collage],
  validation,
  verification
);
router.post("/login", [email, password], validation, login);
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put(
  "/update-skills",
  [skills],
  validation,
  isAuthenticated,
  updateSkills
);
router.put("/update-profile", isAuthenticated, updateUserProfile);
router.get("/info", isAuthenticated, getUserInfo);
router.post("/certifications", isAuthenticated, addCertification);
router.put("/certifications/:id", isAuthenticated, updateCertification);
router.delete("/certifications/:id", isAuthenticated, deleteCertification);
router.post("/forget-password", [email], validation, forgetPassword);
router.post("/verify-otp/:email", [otp], validation, verifyOTP);
router.post("/reset-password/:email", [newPassword], validation, resetPassword);

export default router;
