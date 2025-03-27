import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import studentRoutes from "./routes/student.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(
    cors({
      origin: "http://localhost:5173", // Your React frontend URL
      credentials: true, // ✅ Required for cookies
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentor",mentorRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/meetings",meetingRoutes)

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
