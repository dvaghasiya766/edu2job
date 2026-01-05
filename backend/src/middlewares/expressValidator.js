import { check } from "express-validator";

export const name = check("name").notEmpty().withMessage("Name is required");
export const email = check("email")
  .normalizeEmail()
  .isEmail()
  .withMessage("Valid email is required");
export const password = check("password")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number")
  .matches(/[@$!%*?&#]/)
  .withMessage("Password must contain at least one special character")
  .isLength({ min: 8, max: 20 })
  .withMessage("Password must be 8–20 characters long");
export const degree = check("degree")
  .not()
  .isEmpty()
  .withMessage("Degree is required");
export const yearOfPassing = check("yearOfPassing")
  .isLength({ max: 4, min: 4 })
  .withMessage("Year of passing must be a valid 4-digit year");
export const skills = check("skills")
  .isArray({ min: 1 })
  .withMessage("At least one skill is required");
export const CGPA = check("CGPA")
  .notEmpty()
  .withMessage("CGPA is required")
  .isFloat({ min: 0, max: 10 })
  .withMessage("CGPA must be between 0 and 10");
export const certifications = check("certifications")
  .isArray({ min: 1 })
  .withMessage("At least one certification is required");
export const collage = check("collage")
  .notEmpty()
  .withMessage("College name is required");
export const otp = check("otp")
  .notEmpty()
  .withMessage("OTP is required")
  .isLength({ max: 6, min: 6 })
  .withMessage("OTP must be 6 digits long");
export const newPassword = check("newPassword")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number")
  .matches(/[@$!%*?&#]/)
  .withMessage("Password must contain at least one special character")
  .isLength({ min: 8, max: 20 })
  .withMessage("Password must be 8–20 characters long");
