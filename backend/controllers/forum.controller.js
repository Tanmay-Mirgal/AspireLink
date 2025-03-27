import Forum from "../models/forum.model.js";
import { User } from "../models/user.model.js";

export const createForum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const mentorId = req.user._id;

    const mentor = await User.findById(mentorId);
    if (!mentor && mentor.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can create forums",
      });
    }

    // Validate input
    if (!title) {
      return res.status(400).json({
        message: "Forum title is required",
      });
    }

    // Check if a forum with the same title already exists
    const existingForum = await Forum.findOne({
      topic: title.trim(),
    });

    if (existingForum) {
      return res.status(400).json({
        message: "A forum with this title already exists",
      });
    }

    // Create new forum
    const newForum = new Forum({
      topic: title.trim(),
      description: description?.trim() || "",
      mentorId: mentorId,
      members: [], // No members initially
    });

    // Save the forum
    await newForum.save();

    // Respond with success
    return res.status(201).json({
      message: "Forum created successfully",
      forum: {
        _id: newForum._id,
        topic: newForum.topic,
        description: newForum.description,
        mentorId: newForum.mentorId,
      },
    });
  } catch (error) {
    console.error("Create forum error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const joinForum = async (req, res) => {
  try {
    const forumId = req.params.id;
    const userId = req.user._id;

    // Check if user is a student
    const user = await User.findById(userId);
    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can join forums",
      });
    }

    // Find the forum
    const forum = await Forum.findById(forumId);

    if (!forum) {
      return res.status(404).json({
        message: "Forum not found",
      });
    }

    // Check if user is already a member
    if (forum.members.includes(userId)) {
      return res.status(400).json({
        message: "You are already a member of this forum",
      });
    }

    // Add user to members
    forum.members.push(userId);
    await forum.save();

    return res.status(200).json({
      message: "Joined forum successfully",
      forum: {
        _id: forum._id,
        topic: forum.topic,
        members: forum.members,
      },
    });
  } catch (error) {
    console.error("Join forum error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const addMessageToForum = async (req, res) => {
    try {
      const forumId = req.params.id;
      const userId = req.user._id;
      const { content } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
  
      if (!forum.members.includes(userId)) {
        return res
          .status(403)
          .json({ message: "You are not a member of this forum" });
      }
  
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Message content is required" });
      }
  
      const newMessage = {
        sender: userId,
        content: content.trim(),
        timestamp: new Date(),
      };
  
      forum.messages.push(newMessage);
      await forum.save();
  
      const updatedForum = await Forum.findById(forumId)
        .populate("mentorId", "fullName email")
        .populate("members", "fullName email")
        .populate("messages.sender", "fullName email");
  
      return res.status(200).json({
        message: "Message added successfully",
        forum: updatedForum,
      });
    } catch (error) {
      console.error("Error adding message to forum:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
  
export const allForums = async (req, res) => {
    try {
      // Optional: Pagination support
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const forums = await Forum.find({})
        .populate("mentorId", "fullName email")
        .populate("members", "fullName email")
        .populate("messages.sender", "fullName email") // Populate sender in messages
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      return res.status(200).json({
        message: "All forums retrieved successfully",
        forums,
        page,
        total: forums.length,
      });
    } catch (error) {
      console.error("All forums error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
};
  
export const getForumById = async (req, res) => {
    try {
      const forumId = req.params.id;
  
      const forum = await Forum.findById(forumId)
        .populate("mentorId", "fullName email")
        .populate("members", "fullName email")
        .populate("messages.sender", "fullName email"); // Populate sender in messages
  
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
  
      return res.status(200).json({
        message: "Forum retrieved successfully",
        forum,
      });
    } catch (error) {
      console.error("Get forum by ID error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
};
