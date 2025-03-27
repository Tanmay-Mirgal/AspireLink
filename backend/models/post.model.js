import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            content:{
                type: String,
                required: true,
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
},{
    timestamps: true,
})