import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleID: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["admin", "student"], default: "student" },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    degree: { type: String },
    yearOfPassing: { type: Number },
    skills: [{ type: String }],
    CGPA: { type: String },
    Certifications: [{ type: Object }],
    Collage: { type: String },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: "Email already exists" });

export const User = mongoose.model("User", userSchema);
