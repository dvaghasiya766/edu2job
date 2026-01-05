import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";
import { JobPrediction } from "../models/jobPrediction.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalPredictions = await JobPrediction.countDocuments();
    
    const recentPredictions = await JobPrediction.find()
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
          accuracy: 70.0
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
    console.log('Admin getAllPredictions called');
    const predictions = await JobPrediction.find()
      .populate({
        path: 'userID',
        select: 'name email degree yearOfPassing CGPA',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });
    
    console.log('Found predictions:', predictions.length);
    
    return res.status(200).json({
      success: true,
      predictions: predictions.map(p => ({
        _id: p._id,
        user: p.userID || { name: 'Unknown User', email: 'N/A' },
        predictedJobRoles: p.predictedJobRoles || [],
        userProfile: p.userProfile || {},
        feedback: p.feedback,
        createdAt: p.createdAt
      })),
      totalPredictions: predictions.length
    });

  } catch (error) {
    console.error('Admin getAllPredictions error:', error);
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

    const userPredictions = await JobPrediction.find({ userID: userId })
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
export const testJobPredictions = async (req, res, next) => {
  try {
    const count = await JobPrediction.countDocuments();
    const predictions = await JobPrediction.find().limit(3);
    
    return res.status(200).json({
      success: true,
      message: `Found ${count} JobPredictions in database`,
      totalCount: count,
      samplePredictions: predictions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};