import Forum from '../models/Forum.js';
import User from '../models/User.js';

export const createForum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Check if user is a mentor
    const user = await User.findById(userId);
    if (user.role !== 'mentor') {
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
      topic: title.trim() 
    });

    if (existingForum) {
      return res.status(400).json({
        message: "A forum with this title already exists",
      });
    }

    // Create new forum
    const newForum = new Forum({
      topic: title.trim(),
      description: description?.trim() || '',
      mentorId: userId,
      members: [] // No members initially
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
        mentorId: newForum.mentorId
      }
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
    const forumId = req.params.forumId;
    const userId = req.user._id;

    // Check if user is a student
    const user = await User.findById(userId);
    if (user.role !== 'student') {
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
        members: forum.members
      }
    });

  } catch (error) {
    console.error("Join forum error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};