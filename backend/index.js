import express from "express";
import cors from "cors";
import { httpError } from "./src/models/http.error.js";
import { connectDB } from "./src/database/db.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import googleAuthRoutes from "./src/routes/auth.routes.js";
import predictionRoutes from "./src/routes/prediction.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import passport from "passport";
import "./src/configs/passport.js";
import "dotenv/config";

// App Configuration
const app = express();
app.use(express.json());
app.use(passport.initialize());

// App Cors Settings
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Custome APIs
app.use("/api/auth", (req, res) => {
  res.status(200).json({ success: true, message: "Connection is Good!" });
});

app.use("/users", userRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/admin", adminRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ success: true, message: "Server is working!" });
});

// http://localhost:8000/users

// Out of above Route Handling
app.use((req, res, next) => {
  return next(new httpError("Could not find this Route.", 404));
});

// Error Handling
app.use((err, req, res, nxt) => {
  if (res.headerSent) {
    return nxt(err);
  }
  res.status(err.code || 500).json({
    success: false,
    message: err.message || "An unknown error occurred!!",
    errors: err.errors,
  });
});

// DB Connection
connectDB()
  .then((msg) => {
    console.log(msg);
    app.listen(process.env.PORT, () =>
      console.log(`server is listing at http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Server startup aborted due to DB error."));
