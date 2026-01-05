import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import { JobPrediction } from "../models/jobPrediction.js";
import axios from "axios";
import mongoose from "mongoose";

const ML_MODEL_URL = process.env.ML_MODEL_URL || "http://127.0.0.1:5000";

const mapDegreeToMLFormat = (degree) => {
  const degreeMap = {
    "Bachelor of Computer Science": "B.Tech",
    "Bachelor of Technology": "B.Tech",
    "Master of Technology": "M.Tech",
    "Bachelor of Computer Applications": "BCA",
    "Doctor of Philosophy": "PhD",
    Other: "Other",
  };
  return degreeMap[degree] || "B.Tech";
};

const mapSpecializationToMLFormat = (skills) => {
  if (!skills || skills.length === 0) return "CSE";
  const skillsStr = skills.join(" ").toLowerCase();
  if (skillsStr.includes("ai") || skillsStr.includes("artificial intelligence")) return "AI";
  if (skillsStr.includes("ml") || skillsStr.includes("machine learning")) return "ML";
  if (skillsStr.includes("data") || skillsStr.includes("analytics")) return "DS";
  if (skillsStr.includes("web") || skillsStr.includes("frontend") || skillsStr.includes("backend")) return "IT";
  if (skillsStr.includes("computer") || skillsStr.includes("software")) return "CSE";
  return "CSE";
};

export const predictJobRole = async (req, res, next) => {
  try {
    console.log('=== PREDICTION START ===');
    const userId = req.userId;
    console.log('User ID:', userId);
    
    if (!userId) {
      return next(new httpError("Authentication failed", 401));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }
    console.log('User found:', user.name);

    // Prepare data for Python ML server
    const mlInput = {
      degree: mapDegreeToMLFormat(user.degree),
      specialization: mapSpecializationToMLFormat(user.skills),
      cgpa: parseFloat(user.CGPA) || 7.0,
      year_of_passing: user.yearOfPassing || 2024,
      certifications: user.Certifications ? user.Certifications.length : 0
    };

    console.log('ML Input:', mlInput);
    
    let predictions;
    let mlSuccess = false;
    
    try {
      console.log('Calling ML server...');
      const response = await axios.post(`${ML_MODEL_URL}/predict`, mlInput, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('ML Response:', response.data);
      
      if (response.data && response.data.predictions) {
        predictions = response.data.predictions;
        mlSuccess = true;
        console.log('ML server success!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (mlError) {
      console.log('ML server failed:', mlError.message);
      predictions = generateFallbackPredictions(user.skills, user.degree);
      console.log('Using fallback predictions:', predictions);
    }

    // Save to database
    const predictionData = {
      userID: new mongoose.Types.ObjectId(userId),
      predictedJobRoles: predictions,
      userProfile: {
        degree: user.degree || "Bachelor of Technology",
        specialization: mapSpecializationToMLFormat(user.skills),
        yearOfPassing: user.yearOfPassing || 2024,
        cgpa: parseFloat(user.CGPA) || 7.0,
        certifications: user.Certifications ? user.Certifications.length : 0
      },
      modelMetrics: {
        f1Score: mlSuccess ? 86 : 75,
        accuracy: mlSuccess ? 85.0 : 70.0
      }
    };

    console.log('Saving prediction data:', JSON.stringify(predictionData, null, 2));
    
    const newPrediction = new JobPrediction(predictionData);
    const savedPrediction = await newPrediction.save();
    
    console.log('Prediction saved successfully! ID:', savedPrediction._id);
    console.log('=== PREDICTION END ===');

    return res.status(200).json({
      success: true,
      message: "Job role prediction successful",
      predictions,
      predictionId: savedPrediction._id,
      mlServerUsed: mlSuccess
    });
    
  } catch (error) {
    console.error('=== PREDICTION ERROR ===');
    console.error('Error details:', error);
    return next(new httpError(error.message, 500));
  }
};

const generateFallbackPredictions = (skills, degree) => {
  const skillsStr = skills ? skills.join(" ").toLowerCase() : "";
  const predictions = [];

  if (skillsStr.includes("data") || skillsStr.includes("analytics")) {
    predictions.push({ job_role: "Data Analyst", confidence: 85 });
    predictions.push({ job_role: "Data Scientist", confidence: 75 });
    predictions.push({ job_role: "Business Analyst", confidence: 65 });
  } else if (skillsStr.includes("web") || skillsStr.includes("react") || skillsStr.includes("javascript")) {
    predictions.push({ job_role: "Frontend Developer", confidence: 80 });
    predictions.push({ job_role: "Full Stack Developer", confidence: 70 });
    predictions.push({ job_role: "Web Developer", confidence: 65 });
  } else if (skillsStr.includes("java") || skillsStr.includes("python")) {
    predictions.push({ job_role: "Software Developer", confidence: 85 });
    predictions.push({ job_role: "Backend Developer", confidence: 75 });
    predictions.push({ job_role: "Software Engineer", confidence: 70 });
  } else {
    predictions.push({ job_role: "Software Developer", confidence: 75 });
    predictions.push({ job_role: "IT Specialist", confidence: 70 });
    predictions.push({ job_role: "Technical Analyst", confidence: 65 });
  }

  return predictions;
};

export const getJobInsights = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    const insights = {
      skillsAnalysis: {
        totalSkills: user.skills ? user.skills.length : 0,
        techStack: user.skills || [],
        recommendations: generateSkillRecommendations(user.skills),
      },
      certificationAnalysis: {
        totalCertifications: user.Certifications ? user.Certifications.length : 0,
        recentCertifications: user.Certifications ? user.Certifications.filter(
          (cert) => cert.year >= new Date().getFullYear() - 2
        ) : [],
        suggestions: generateCertificationSuggestions(user.skills),
      },
      profileStrength: calculateProfileStrength(user),
    };

    return res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const { predictionId } = req.params;
    const { rating } = req.body;
    const userId = req.userId;

    if (!rating || !["good", "bad", "avg"].includes(rating)) {
      return next(new httpError("Valid rating (good/bad/avg) is required", 400));
    }

    const prediction = await JobPrediction.findOne({
      _id: predictionId,
      userID: userId,
    });
    if (!prediction) {
      return next(new httpError("Prediction not found", 404));
    }

    prediction.feedback = rating;
    await prediction.save();

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return next(new httpError(error.message, 500));
  }
};

export const getPredictionHistory = async (req, res, next) => {
  try {
    const userId = req.userId;

    const predictions = await JobPrediction.find({ userID: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      predictions,
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

const generateSkillRecommendations = (skills) => {
  const recommendations = [];
  const skillsStr = skills ? skills.join(" ").toLowerCase() : "";

  if (!skillsStr.includes("react") && skillsStr.includes("javascript")) {
    recommendations.push("React.js - Popular frontend framework");
  }
  if (!skillsStr.includes("node") && skillsStr.includes("javascript")) {
    recommendations.push("Node.js - Backend JavaScript runtime");
  }
  if (!skillsStr.includes("python") && skillsStr.includes("data")) {
    recommendations.push("Python - Essential for data science");
  }
  if (!skillsStr.includes("aws") && !skillsStr.includes("cloud")) {
    recommendations.push("AWS/Cloud Computing - High demand skill");
  }

  return recommendations.slice(0, 3);
};

const generateCertificationSuggestions = (skills) => {
  const suggestions = [];
  const skillsStr = skills ? skills.join(" ").toLowerCase() : "";

  if (skillsStr.includes("aws") || skillsStr.includes("cloud")) {
    suggestions.push("AWS Certified Solutions Architect");
  }
  if (skillsStr.includes("data") || skillsStr.includes("analytics")) {
    suggestions.push("Google Data Analytics Certificate");
  }
  if (skillsStr.includes("javascript") || skillsStr.includes("web")) {
    suggestions.push("Meta Frontend Developer Certificate");
  }

  return suggestions.slice(0, 3);
};

const calculateProfileStrength = (user) => {
  let score = 0;
  if (user.degree) score += 20;
  if (user.CGPA && parseFloat(user.CGPA) >= 7.0) score += 20;
  if (user.skills && user.skills.length >= 3) score += 20;
  if (user.Certifications && user.Certifications.length >= 2) score += 20;
  if (user.yearOfPassing && parseInt(user.yearOfPassing) >= 2020) score += 20;

  return {
    score,
    level: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs Improvement",
    suggestions: score < 80 ? ["Add more relevant skills", "Obtain industry certifications", "Maintain good academic performance"] : ["Your profile looks great!"],
  };
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" })
      .select("-password -token -otp -otpExpiry")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
      totalUsers: users.length,
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getAllPredictions = async (req, res, next) => {
  try {
    const predictions = await JobPrediction.find()
      .populate("userID", "name email degree yearOfPassing CGPA skills")
      .sort({ createdAt: -1 });

    const feedbackStats = {
      good: predictions.filter((p) => p.feedback === "good").length,
      avg: predictions.filter((p) => p.feedback === "avg").length,
      bad: predictions.filter((p) => p.feedback === "bad").length,
      total: predictions.length
    };

    const modelAccuracy = feedbackStats.total > 0 
      ? (feedbackStats.good / feedbackStats.total * 100).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      predictions: predictions.map(p => ({
        _id: p._id,
        user: p.userID,
        predictedJobRoles: p.predictedJobRoles,
        userProfile: p.userProfile,
        feedback: p.feedback,
        modelMetrics: p.modelMetrics,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      })),
      totalPredictions: predictions.length,
      feedbackStats,
      modelMetrics: {
        accuracy: parseFloat(modelAccuracy),
        f1Score: 86,
        totalPredictions: predictions.length
      }
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};
// Admin-specific endpoints
export const getAdminPredictions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, userId, feedback } = req.query;
    
    let filter = {};
    if (userId) filter.userID = userId;
    if (feedback) filter.feedback = feedback;

    const predictions = await JobPrediction.find(filter)
      .populate("userID", "name email degree yearOfPassing CGPA skills")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobPrediction.countDocuments(filter);

    return res.status(200).json({
      success: true,
      predictions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getPredictionById = async (req, res, next) => {
  try {
    const { predictionId } = req.params;
    
    const prediction = await JobPrediction.findById(predictionId)
      .populate("userID", "name email degree yearOfPassing CGPA skills Certifications");

    if (!prediction) {
      return next(new httpError("Prediction not found", 404));
    }

    return res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};
// Debug endpoints
export const testPredictionSave = async (req, res, next) => {
  try {
    console.log('Testing prediction save...');
    
    const testPrediction = new JobPrediction({
      userID: new mongoose.Types.ObjectId(),
      predictedJobRoles: [
        { job_role: "Test Developer", confidence: 85 },
        { job_role: "Test Analyst", confidence: 75 }
      ],
      userProfile: {
        degree: "Test Degree",
        specialization: "Test",
        yearOfPassing: 2024,
        cgpa: 8.0,
        certifications: 1
      }
    });

    const saved = await testPrediction.save();
    console.log('Test prediction saved:', saved._id);

    return res.status(200).json({
      success: true,
      message: "Test prediction saved",
      predictionId: saved._id
    });
  } catch (error) {
    console.error('Test save error:', error);
    return next(new httpError(error.message, 500));
  }
};

export const debugGetPredictions = async (req, res, next) => {
  try {
    console.log('Getting all predictions for debug...');
    
    const count = await JobPrediction.countDocuments();
    console.log('Total predictions in DB:', count);
    
    const predictions = await JobPrediction.find()
      .populate("userID", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('Found predictions:', predictions.length);
    
    return res.status(200).json({
      success: true,
      totalCount: count,
      predictions: predictions,
      message: `Found ${count} predictions in database`
    });
  } catch (error) {
    console.error('Debug get error:', error);
    return next(new httpError(error.message, 500));
  }
};