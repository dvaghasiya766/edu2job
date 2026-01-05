import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import axios from "axios";

const ML_MODEL_URL = process.env.ML_MODEL_URL || 'http://localhost:5000';

// Map frontend degree names to ML model format
const mapDegreeToMLFormat = (degree) => {
  const degreeMap = {
    "Bachelor of Computer Science": "B.Tech",
    "Bachelor of Technology": "B.Tech", 
    "Master of Technology": "M.Tech",
    "Bachelor of Computer Applications": "BCA",
    "Doctor of Philosophy": "PhD",
    "Other": "Other"
  };
  return degreeMap[degree] || "B.Tech";
};

// Map specialization to ML model format
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
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    if (!user.degree || !user.yearOfPassing || !user.CGPA) {
      return next(new httpError("Please complete your profile first", 400));
    }

    // Prepare data for ML model
    const mlData = {
      Degree: mapDegreeToMLFormat(user.degree),
      Specialization: mapSpecializationToMLFormat(user.skills),
      YOP: parseInt(user.yearOfPassing),
      CGPA: parseFloat(user.CGPA),
      Certifications: user.Certifications ? user.Certifications.length : 0
    };

    // Call ML model API
    const response = await axios.post(`${ML_MODEL_URL}/predict`, mlData);
    
    return res.status(200).json({
      success: true,
      message: "Job role prediction successful",
      predictions: response.data.predictions,
      userProfile: {
        name: user.name,
        degree: user.degree,
        specialization: mapSpecializationToMLFormat(user.skills),
        yearOfPassing: user.yearOfPassing,
        cgpa: user.CGPA,
        certifications: user.Certifications ? user.Certifications.length : 0
      }
    });

  } catch (error) {
    if (error.response) {
      return next(new httpError(`ML Model Error: ${error.response.data.error}`, 500));
    }
    return next(new httpError(error.message, 500));
  }
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
        recommendations: generateSkillRecommendations(user.skills)
      },
      certificationAnalysis: {
        totalCertifications: user.Certifications ? user.Certifications.length : 0,
        recentCertifications: user.Certifications ? 
          user.Certifications.filter(cert => cert.year >= new Date().getFullYear() - 2) : [],
        suggestions: generateCertificationSuggestions(user.skills)
      },
      profileStrength: calculateProfileStrength(user)
    };

    return res.status(200).json({
      success: true,
      insights
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
    suggestions: score < 80 ? [
      "Add more relevant skills",
      "Obtain industry certifications", 
      "Maintain good academic performance"
    ] : ["Your profile looks great!"]
  };
};