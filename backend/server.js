// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import studentRoutes from "./routes/student.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import forumRoutes from "./routes/forum.routes.js";
import postRoutes from "./routes/post.routes.js"
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();

// Create HTTP server
const server = createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true, // Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/forums",forumRoutes);
app.use('/api/posts',postRoutes);

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  // Handle joining a forum room
  socket.on("join_forum", (forumId) => {
    socket.join(forumId);
    console.log(`User ${socket.id} joined forum: ${forumId}`);
  });
  
  // Handle leaving a forum room
  socket.on("leave_forum", (forumId) => {
    socket.leave(forumId);
    console.log(`User ${socket.id} left forum: ${forumId}`);
  });
  
  // Handle new messages
  socket.on("new_message", (messageData) => {
    // Broadcast the message to all clients in the forum room except sender
    socket.to(messageData.forumId).emit("receive_message", messageData);
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Pass 'server' instead of 'app' to listen
server.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Make io accessible to other files
export { io };