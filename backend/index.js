import express from "express";
import cors from "cors";
import { httpError } from "./src/models/http.error.js";
import { connectDB } from "./src/database/db.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import predictionRoutes from "./src/routes/prediction.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import passport from "passport";
import "./src/configs/passport.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options('*', cors());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.json({ success: true, message: "Server is working!" });
});

app.use((req, res, next) => {
  return next(new httpError("Could not find this Route.", 404));
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500).json({
    success: false,
    message: err.message || "An unknown error occurred!!",
    errors: err.errors,
  });
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running at http://localhost:${process.env.PORT}`)
    );
  })
  .catch(() => console.error("Server startup failed."));
