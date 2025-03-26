import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user:savedUser
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
export const setRole = async (req, res) => {
  try {
    const { role } = req.body;

    const userId = req.user._id;

    if (!["student", "mentor"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Choose either 'student' or 'mentor'" });
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set the new role
    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user
    });
  } catch (error) {
    console.error("Set role error:", error);
    res
      .status(500)
      .json({ message: "Failed to update role", error: error.message });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by auth middleware)
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve profile", error: error.message });
  }
};
export const completeProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by auth middleware)
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic profile information if provided
    const { firstName, lastName, bio, profilePic } = req.body;

    if (firstName) user.fullName.firstName = firstName;
    if (lastName) user.fullName.lastName = lastName;
    if (bio) user.bio = bio;
    if (profilePic) user.profilePic = profilePic;

    // Handle role-specific profile updates
    if (user.role === "student") {
      const { skills, education, socialMedia } = req.body;

      // Update student profile if data is provided
      if (skills) user.studentProfile.skills = skills;
      if (education) user.studentProfile.education = education;
      if (socialMedia) {
        user.studentProfile.socialMedia = [
          {
            github: { url: socialMedia.github },
            leetcode: { url: socialMedia.leetcode },
            linkedIn: { url: socialMedia.linkedIn },
          },
        ];
      }
    }

    if (user.role === "mentor") {
      const {
        companyName,
        description,
        qualifications,
        experience,
        skills,
        projects,
        contact,
        portfolio,
      } = req.body;

      // Create or update mentor profile
      const mentorProfile = {
        companyName,
        description,
        qualifications,
        experience,
        skills,
        projects,
        contact,
        portfolio,
      };

      // If mentor profile already exists, update it; otherwise, create new
      if (user.mentorSchema && user.mentorSchema.length > 0) {
        Object.assign(user.mentorSchema[0], mentorProfile);
      } else {
        user.mentorSchema = [mentorProfile];
      }
    }

    // Save updated user
    await user.save();

    const responseUser = {
      id: user._id,
      firstName: user.fullName.firstName,
      lastName: user.fullName.lastName,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      bio: user.bio,
    };

    if (user.role === "student") {
      responseUser.studentProfile = user.studentProfile;
    } else if (user.role === "mentor") {
      responseUser.mentorProfile = user.mentorSchema[0];
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};
