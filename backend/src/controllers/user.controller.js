import jwt from "jsonwebtoken";
import { PasswordService } from "../service/hashing.js";
import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import { verifyMail } from "../service/mail/emailVarify.js";
import { sendOTP } from "../service/mail/sendOTP.js";

export const register = async (req, res, next) => {
  try {
    //   Fetch Data
    const { name, email, password } = req.body;
    //   Varifing Data
    if (!name || !email || !password) {
      return next(new httpError("All fields are requireds", 400));
    }
    //   Email already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new httpError("Invalid Information", 400, {
          message: "Email already exists",
          path: "email",
        })
      );
    }

    // Secure Password
    const hashedPassword = await PasswordService.hash(password);
    //   Add New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    // Varify Mail
    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await verifyMail(token, email);
    newUser.token = token;
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: newUser.toObject({ getters: true }),
    });
  } catch (e) {
    return next(new httpError(e.message, 500));
  }
};

export const verification = async (req, res, next) => {
  try {
    const { degree, yearOfPassing, skills, CGPA, certifications, collage } =
      req.body;
    if (
      !degree ||
      !yearOfPassing ||
      !skills ||
      !CGPA ||
      !certifications ||
      !collage
    ) {
      return next(new httpError("All fields are requireds", 400));
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new httpError("Authorization header missing", 401));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return next(new httpError("Token has expired", 400));
      } else {
        return next(new httpError("Invalid token", 401));
      }
    }

    const user = await User.findOne({ _id: decoded.id, token: token });
    if (!user) {
      return next(new httpError("User not found", 404));
    }
    user.token = null;
    user.isVerified = true;
    user.status = "active";
    user.degree = degree;
    user.yearOfPassing = yearOfPassing;
    user.skills = skills;
    user.CGPA = CGPA;
    user.Certifications = certifications;
    user.Collage = collage;
    // Add Rest Fields
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: user.toObject({ getters: true }),
    });
  } catch (e) {
    return next(new httpError(e.message, 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new httpError("All fields are requireds", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new httpError("Invalid Information", 400, {
          message: "Email not found",
          path: "email",
        })
      );
    }
    const isMatch = await PasswordService.compare(password, user.password);
    if (!isMatch) {
      return next(
        new httpError("Invalid Information", 400, {
          message: "Invalid password",
          path: "password",
        })
      );
    }
    // Check user is Status: Active & isVerified: true
    if (user.isVerified !== true) {
      return next(
        new httpError("User is not Verified!", 400, {
          path: "isVerified",
          message:
            "Please verify your account first. Check your email for the verification link.",
        })
      );
    }
    if (user.status !== "active") {
      return next(
        new httpError("User is not active", 400, {
          path: "status",
          message: "Kindly make a request to active account",
        })
      );
    }

    // Create JWT Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_SESSION,
      {
        expiresIn: "5d",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_SESSION,
      {
        expiresIn: "30d",
      }
    );
    // Create New Session
    await Session.create({ userId: user._id, token: accessToken });
    user.isLoggedIn = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `Wel-Come back, ${user.name}`,
      accessToken,
      refreshToken,
      user: user.toObject({ getters: true }),
    });
  } catch (e) {
    return next(new httpError(e.message, 500));
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (e) {
    return next(new httpError(e.message, 500));
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "User not found",
          path: "email",
        })
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTP(otp, email, user.name);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {}
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "User not found",
          path: "email",
        })
      );
    }
    if (!user.otp || !user.otpExpiry) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "OTP not generated or verified",
          path: "otp",
        })
      );
    }
    if (user.otpExpiry < new Date()) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "OTP expired",
          path: "otp",
        })
      );
    }
    if (user.otp !== otp) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "Invalid OTP",
          path: "otp",
        })
      );
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confrimPassword } = req.body;
    const email = req.params.email;

    if (newPassword !== confrimPassword) {
      return next(
        new httpError("Invalid Information", 400, {
          message: "Passwords do not match",
          path: "password",
        })
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new httpError("Invalid Information", 401, {
          message: "User not found",
          path: "email",
        })
      );
    }
    const hashedPassword = await PasswordService.hash(newPassword);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const userId = req.userId;

    if (!skills || !Array.isArray(skills)) {
      return next(new httpError("Skills array is required", 400));
    }

    if (skills.length === 0) {
      return next(new httpError("At least one skill is required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    user.skills = skills;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Skills updated successfully",
      skills: user.skills,
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select(
      "-password -token -otp -otpExpiry"
    );
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    return res.status(200).json({
      success: true,
      user: user.toObject({ getters: true }),
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      name,
      degree,
      yearOfPassing,
      skills,
      CGPA,
      certifications,
      Collage,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    if (name) user.name = name;
    if (degree) user.degree = degree;
    if (yearOfPassing) user.yearOfPassing = yearOfPassing;
    if (skills && Array.isArray(skills)) user.skills = skills;
    if (CGPA) user.CGPA = CGPA;
    if (certifications && Array.isArray(certifications))
      user.Certifications = certifications;
    if (Collage) user.Collage = Collage;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user.toObject({
        getters: true,
        transform: (doc, ret) => {
          delete ret.password;
          delete ret.token;
          delete ret.otp;
          delete ret.otpExpiry;
          return ret;
        },
      }),
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select(
      "-password -token -otp -otpExpiry"
    );

    if (!user) {
      return next(new httpError("User not found", 404));
    }

    return res.status(200).json({
      success: true,
      user: user.toObject({ getters: true }),
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const addCertification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, issuer, year } = req.body;

    if (!title || !issuer || !year) {
      return next(new httpError("All fields are required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    const newCertification = {
      title,
      issuer,
      year,
      _id: new Date().getTime().toString(),
    };
    user.Certifications = user.Certifications || [];
    user.Certifications.push(newCertification);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Certification added successfully",
      certification: newCertification,
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, issuer, year } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    const certIndex = user.Certifications.findIndex((cert) => cert._id === id);
    if (certIndex === -1) {
      return next(new httpError("Certification not found", 404));
    }

    user.Certifications[certIndex] = {
      ...user.Certifications[certIndex],
      title,
      issuer,
      year,
    };
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      certification: user.Certifications[certIndex],
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    user.Certifications = user.Certifications.filter((cert) => cert._id !== id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};
