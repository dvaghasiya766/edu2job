import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import { Prediction } from "../models/prediction.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalPredictions = await Prediction.countDocuments();
    
    const recentPredictions = await Prediction.find()
      .populate('userID', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPredictions,
        modelMetrics: {
          f1Score: 86,
          accuracy: 70.0,
          datasetRows: 3200
        }
      },
      recentPredictions
    });

  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" })
      .select("-password -token -otp -otpExpiry")
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      users,
      totalUsers: users.length
    });

  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getAllPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find()
      .populate('userID', 'name email degree yearOfPassing CGPA')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      predictions,
      totalPredictions: predictions.length,
      modelMetrics: {
        f1Score: 86,
        accuracy: 70.0,
        datasetRows: 3200
      }
    });

  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select("-password -token -otp -otpExpiry");
    
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    const userPredictions = await Prediction.find({ userID: userId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      user,
      predictions: userPredictions,
      totalPredictions: userPredictions.length
    });

  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};