import {User} from "../models/user.model.js"
import Post from "../models/post.model.js"
import { uploadToCloudinary } from "../utils/utility.js"
import fs from 'fs'

export const createPost = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const { image } = req.files || {};  // Ensure `image` is extracted properly
        const loggedInUser = req.user._id;

        // Fetch user details
        const user = await User.findById(loggedInUser)
            .select('-password')
            .populate('posts');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        let imageUrl = null;
        if (image) {
            // Upload image to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: 'Posts' });
                imageUrl = result.secure_url;
                console.log(imageUrl); // Log the image URL to the console
            } catch (cloudinaryError) {
                return res.status(400).json({ message: 'Error uploading image' });
            }
        }

        // Create new post
        const newPost = new Post({
            user: user._id,
            image: imageUrl || user.img,  // Assign image if available, else use existing image
            title,
            description,
            location,
        });

        // Save new post to DB
        const savedPost = await newPost.save();

        // Add new post to user’s posts array
        user.posts.push(savedPost._id);
        await user.save();

        // Delete temp image file
        if (image && image.tempFilePath) {
            try {
                fs.unlinkSync(image.tempFilePath);
            } catch (fileError) {
                console.error('Error deleting temporary image file:', fileError);
            }
        }

        return res.status(201).json({
            message: 'Post created successfully',
            post: savedPost,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find posts with pagination, sorted by most recent
        const posts = await Post.find()
            .populate('author', 'fullName.firstName fullName.lastName profilePic')
            .populate('comments.author', 'fullName.firstName fullName.lastName profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total posts for pagination
        const totalPosts = await Post.countDocuments();

        res.status(200).json({
            message: "Posts retrieved successfully",
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts
            }
        });
    } catch (error) {
        console.error("Error getting posts:", error);
        res.status(500).json({
            message: "Failed to retrieve posts",
            error: error.message
        });
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        const post = await Post.findById(postId)
            .populate('author', 'fullName.firstName fullName.lastName profilePic email')
            .populate('comments.author', 'fullName.firstName fullName.lastName profilePic')
            .populate('likes', 'fullName.firstName fullName.lastName profilePic');

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post retrieved successfully",
            post
        });
    } catch (error) {
        console.error("Error getting post by ID:", error);
        res.status(500).json({
            message: "Failed to retrieve post",
            error: error.message
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Authenticated user

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        // Find and delete the post
        const deletedPost = await Post.findOneAndDelete({
            _id: postId,
            author: userId
        });

        if (!deletedPost) {
            return res.status(404).json({
                message: "Post not found or you're not authorized to delete"
            });
        }

        // Remove post reference from user's posts
        await User.findByIdAndUpdate(userId, {
            $pull: { posts: postId }
        });

        // If post had an image, delete from Cloudinary (optional)
        if (deletedPost.img) {
            // You would need to implement Cloudinary deletion logic here
            // This is a placeholder for that functionality
        }

        res.status(200).json({
            message: "Post deleted successfully",
            post: deletedPost
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
}