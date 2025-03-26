import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173", // Allow only frontend to access this server
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add necessary methods
allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
