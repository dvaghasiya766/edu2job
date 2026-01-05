import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const predictionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    predictedValue: { type: Object, required: true },
  },
  { timestamps: true }
);

predictionSchema.plugin(uniqueValidator, { message: "Email already exists" });

export const Prediction = mongoose.model("Prediction", predictionSchema);
