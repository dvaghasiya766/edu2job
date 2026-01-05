import { httpError } from "../models/http.error.js";
import { User } from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new httpError("User not found", 404));
    }

    if (user.role !== "admin") {
      return next(new httpError("Access denied. Admin privileges required.", 403));
    }

    next();
  } catch (error) {
    return next(new httpError(error.message, 500));
  }
};