import {User} from "../models/user.model.js"
import Post from "../models/post.model.js"
import { uploadToCloudinary } from "../utils/utility.js"
import fs from 'fs'

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log(req.files)
        const { image } = req.files || {};  
        const loggedInUser = req.user._id;

        // Fetch user details
        const user = await User.findById(loggedInUser)
            .select('-password')
            .populate('posts');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        let imageUrl ;
        if (image) {
            // Upload image to Cloudinary
            try {
             imageUrl = await uploadToCloudinary(image.tempFilePath, { folder: 'Posts' });
               
            } catch (cloudinaryError) {
                return res.status(400).json({ message: 'Error uploading image' });
            }
        }
         console.log(imageUrl)
        // Create new post
        const newPost = new Post({
            author: user._id,
            img: imageUrl || '',  // Assign image if available, else use empty string
            title,
            content
        });

        // Save new post to DB
        const savedPost = await newPost.save();
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
export const getAllPost = async (req, res) => {
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
        if(!posts){
            return res.status(404).json({ message: "No posts found" });
        }
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
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { title, content } = req.body;
        const { image } = req.files || {};

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        // Find post and check ownership
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check if user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this post"
            });
        }

        // Process image if provided
        let imageUrl = post.img;
        if (image) {
            try {
                const result = await uploadToCloudinary(image.tempFilePath, { folder: 'Posts' });
                imageUrl = result.secure_url;
                
                // Delete temp image file
                if (image.tempFilePath) {
                    fs.unlinkSync(image.tempFilePath);
                }
            } catch (cloudinaryError) {
                return res.status(400).json({ message: 'Error uploading image' });
            }
        }

        // Update post
        post.title = title || post.title;
        post.content = content || post.content;
        post.img = imageUrl;
        
        const updatedPost = await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            message: "Failed to update post",
            error: error.message
        });
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id; // Authenticated user

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        // Find post first to check ownership
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check if user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this post"
            });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Remove post reference from user's posts
        await User.findByIdAndUpdate(userId, {
            $pull: { posts: postId }
        });

        // If post had an image, you could delete from Cloudinary here
        // if (post.img) {
        //     // Implement Cloudinary deletion logic
        // }

        res.status(200).json({
            message: "Post deleted successfully",
            post
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
}
export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check if user already liked the post
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            // Like the post
            post.likes.push(userId);
        }

        const updatedPost = await post.save();
        
        await updatedPost.populate('likes', 'fullName.firstName fullName.lastName profilePic');

        res.status(200).json({
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({
            message: "Failed to like/unlike post",
            error: error.message
        });
    }
}
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        // Validate MongoDB ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid post ID format"
            });
        }

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Create new comment
        const newComment = {
            content,
            author: userId
        };

        // Add comment to post
        post.comments.push(newComment);
        const updatedPost = await post.save();
        
        // Populate the new comment's author
        await updatedPost.populate('comments.author', 'fullName.firstName fullName.lastName profilePic');

        res.status(201).json({
            message: "Comment added successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
}
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        // Validate MongoDB ObjectIds
        if (!postId.match(/^[0-9a-fA-F]{24}$/) || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid ID format"
            });
        }

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Find the comment
        const comment = post.comments.id(commentId);
        
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Check if user is the author of the comment or the post
        if (comment.author.toString() !== userId.toString() && 
            post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment"
            });
        }

        // Remove the comment
        comment.remove();
        const updatedPost = await post.save();

        res.status(200).json({
            message: "Comment deleted successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        });
    }
}