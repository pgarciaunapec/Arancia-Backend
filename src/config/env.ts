import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "test") {
  console.error("FATAL: JWT_SECRET environment variable is not set. Exiting.");
  process.exit(1);
}

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant01",
  jwtSecret: process.env.JWT_SECRET || "test-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
