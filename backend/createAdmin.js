import mongoose from "mongoose";
import { User } from "./src/models/userModel.js";
import { PasswordService } from "./src/service/hashing.js";
import "dotenv/config";

const createAdminUser = async () => {
  try {
    // Connect to database
    const uri = process.env.MONGO_DB_URI;
    await mongoose.connect(uri);
    console.log("Connected to database");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "dvaghasiya766@outlook.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await PasswordService.hash("Admin@1234");

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "dvaghasiya766@outlook.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      isVerified: true,
      degree: "Master of Technology",
      yearOfPassing: 2024,
      skills: ["Administration", "Management"],
      CGPA: "9.0",
      Certifications: [],
      Collage: "Admin College"
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log("Email: dvaghasiya766@outlook.com");
    console.log("Password: Admin@1234");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();