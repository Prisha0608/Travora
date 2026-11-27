import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();
console.log("CLIENT_URL:", process.env.CLIENT_URL);
// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: "100kb" }));

// Limit login/register attempts (slows down password guessing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  message: { message: "Too many attempts, please try again later" },
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Travora API is running" });
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/trips", tripRoutes);

// Unknown API route
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});