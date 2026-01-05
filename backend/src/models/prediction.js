import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const predictionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    predictedJobRoles: [{
      job_role: { type: String, required: true },
      confidence: { type: Number, required: true }
    }],
    userProfile: {
      degree: String,
      specialization: String,
      yearOfPassing: Number,
      cgpa: Number,
      certifications: Number
    },
    modelMetrics: {
      f1Score: { type: Number, default: 86 },
      accuracy: { type: Number, default: 70.0 }
    }
  },
  { timestamps: true }
);

predictionSchema.plugin(uniqueValidator);

export const Prediction = mongoose.model("Prediction", predictionSchema);
