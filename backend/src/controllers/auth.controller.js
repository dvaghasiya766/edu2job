import jwt from "jsonwebtoken";
import { httpError } from "../models/http.error.js";

export const oauth = (req, res, next) => {
  try {
    const credential = req.body;

    if (!credential) {
      return next(new httpError("Invalid Credentials", 400));
    }

    jwt.verify(
      credential,
      process.env.OAUTH_CLIENT_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(400).json({
              success: false,
              message:
                "Access Token has expired, use refreshtoken to generate again",
            });
          }
          return res.status(400).json({
            success: false,
            message: "Access token is missing or invalid",
          });
        }
        console.log(decoded);
      }
    );
  } catch (err) {
    return next(new httpError(err.message, 500));
  }
};
