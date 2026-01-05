import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";

const router = express.Router();

router.get("/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_SESSION,
        { expiresIn: "5d" }
      );
      
      const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_SESSION,
        { expiresIn: "30d" }
      );

      await Session.create({ userId: user._id, token: accessToken });

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        status: user.status,
        degree: user.degree,
        yearOfPassing: user.yearOfPassing,
        skills: user.skills,
        CGPA: user.CGPA,
        Certifications: user.Certifications
      };

      // Check if user needs verification (missing profile data)
      const needsVerification = !user.degree || !user.yearOfPassing || !user.skills || !user.CGPA;
      
      if (needsVerification) {
        // Generate verification token for profile completion
        const verificationToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        user.token = verificationToken;
        await user.save();
        res.redirect(`http://localhost:3000/verification?token=${verificationToken}`);
      } else {
        res.redirect(`http://localhost:3000/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${encodeURIComponent(JSON.stringify(userData))}`);
      }
    } catch (error) {
      res.redirect("http://localhost:3000/login?error=auth_failed");
    }
  }
);

export default router;