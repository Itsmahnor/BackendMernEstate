import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import uploadRouter from './Routes/upload.routes.js';
import userRoutes from './Routes/user.routes.js';
import userauth from './Routes/auth.routes.js';
import listingRoutes from './Routes/listingRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Cannot connect to MongoDB:", err);
  });

// CORS Configuration
app.use(cors({
  origin: 'https://mernestateproject.netlify.app/', // Your frontend origin
  credentials: true, // Allow cookies
}));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", userauth);
app.use("/api/listing", listingRoutes);
app.use("/api", uploadRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
