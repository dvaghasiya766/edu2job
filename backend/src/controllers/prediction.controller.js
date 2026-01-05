import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import { JobPrediction } from "../models/jobPrediction.js";
import axios from "axios";

const ML_MODEL_URL = process.env.ML_MODEL_URL || "http://127.0.0.1:5000";

// Map frontend degree names to ML model format
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

// Map specialization to ML model format
const mapSpecializationToMLFormat = (skills) => {
  if (!skills || skills.length === 0) return "CSE";

  const skillsStr = skills.join(" ").toLowerCase();

  if (skillsStr.includes("ai") || skillsStr.includes("artificial intelligence"))
    return "AI";
  if (skillsStr.includes("ml") || skillsStr.includes("machine learning"))
    return "ML";
  if (skillsStr.includes("data") || skillsStr.includes("analytics"))
    return "DS";
  if (
    skillsStr.includes("web") ||
    skillsStr.includes("frontend") ||
    skillsStr.includes("backend")
  )
    return "IT";
  if (skillsStr.includes("computer") || skillsStr.includes("software"))
    return "CSE";

  return "CSE";
};

export const predictJobRole = async (req, res, next) => {
  try {
    console.log('=== PREDICTION API CALLED ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    
    const userId = req.userId;
    console.log('Authenticated User ID:', userId);

    if (!userId) {
      console.log('ERROR: No user ID found in request');
      return next(new httpError("Authentication failed", 401));
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('ERROR: User not found in database for ID:', userId);
      return next(new httpError("User not found", 404));
    }

    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      degree: user.degree,
      skills: user.skills,
      CGPA: user.CGPA
    });

    const degree = user.degree || "Bachelor of Technology";
    const yearOfPassing = user.yearOfPassing || new Date().getFullYear();
    const cgpa = user.CGPA || "7.0";
    const skills = user.skills || ["Programming"];
    const certifications = user.Certifications || [];

    console.log('Processed user data:', {
      degree,
      yearOfPassing,
      cgpa,
      skills,
      certifications: certifications.length
    });

    let predictions;
    
    try {
      console.log('Attempting ML model call...');
      const mlData = {
        Degree: mapDegreeToMLFormat(degree),
        Specialization: mapSpecializationToMLFormat(skills),
        YOP: yearOfPassing,
        CGPA: parseFloat(cgpa),
        Certifications: certifications.length
      };
      
      console.log('ML API URL:', ML_MODEL_URL);
      console.log('ML Data being sent:', JSON.stringify(mlData, null, 2));
      
      const response = await axios.post(`${ML_MODEL_URL}/predict`, mlData, {
        timeout: 5000
      });
      
      predictions = response.data.predictions;
      console.log('ML predictions received:', JSON.stringify(predictions, null, 2));
    } catch (error) {
      console.log('ML model failed:', error.message);
      console.log('Using fallback predictions...');
      predictions = generateFallbackPredictions(skills, degree);
      console.log('Fallback predictions:', JSON.stringify(predictions, null, 2));
    }

    const userProfile = {
      degree,
      specialization: mapSpecializationToMLFormat(skills),
      yearOfPassing,
      cgpa,
      certifications: certifications.length,
    };

    console.log('User profile for prediction:', JSON.stringify(userProfile, null, 2));

    const predictionData = {
      userID: userId,
      predictedJobRoles: predictions,
      userProfile,
      modelMetrics: {
        f1Score: 86,
        accuracy: 70.0,
      }
    };

    console.log('Final prediction data:', JSON.stringify(predictionData, null, 2));
    console.log('Creating new Prediction document...');
    
    const newPrediction = new JobPrediction(predictionData);
    console.log('Prediction document created, attempting to save...');
    console.log('Document before save:', JSON.stringify(newPrediction.toObject(), null, 2));
    
    await newPrediction.save();
    console.log('SUCCESS: Prediction saved with ID:', newPrediction._id);

    const response = {
      success: true,
      message: "Job role prediction successful",
      predictions,
      predictionId: newPrediction._id,
      userProfile: {
        name: user.name,
        ...userProfile,
      },
      modelMetrics: {
        f1Score: 86,
        accuracy: 70.0,
      },
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('=== PREDICTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    console.error('========================');
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
  } else if (
    skillsStr.includes("web") ||
    skillsStr.includes("react") ||
    skillsStr.includes("javascript")
  ) {
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

    // Generate insights based on user profile
    const insights = {
      skillsAnalysis: {
        totalSkills: user.skills ? user.skills.length : 0,
        techStack: user.skills || [],
        recommendations: generateSkillRecommendations(user.skills),
      },
      certificationAnalysis: {
        totalCertifications: user.Certifications
          ? user.Certifications.length
          : 0,
        recentCertifications: user.Certifications
          ? user.Certifications.filter(
              (cert) => cert.year >= new Date().getFullYear() - 2
            )
          : [],
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

    // Validate rating before proceeding
    if (!rating || !["good", "bad", "avg"].includes(rating)) {
      return next(
        new httpError("Valid rating (good/bad/avg) is required", 400)
      );
    }

    const prediction = await JobPrediction.findOne({
      _id: predictionId,
      userID: userId,
    });
    if (!prediction) {
      return next(new httpError("Prediction not found", 404));
    }

    // Set feedback as simple string value
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

// Admin Controllers
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
      .populate("userID", "name email degree yearOfPassing")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      predictions,
      totalPredictions: predictions.length,
      modelMetrics: {
        f1Score: 75.6,
        accuracy: 70.0,
      },
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getUserPredictions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const predictions = await JobPrediction.find({ userID: userId })
      .populate("userID", "name email degree yearOfPassing")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      predictions,
    });
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
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
    level:
      score >= 80
        ? "Excellent"
        : score >= 60
        ? "Good"
        : score >= 40
        ? "Average"
        : "Needs Improvement",
    suggestions:
      score < 80
        ? [
            "Add more relevant skills",
            "Obtain industry certifications",
            "Maintain good academic performance",
          ]
        : ["Your profile looks great!"],
  };
};
