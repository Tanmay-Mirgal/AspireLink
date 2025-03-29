import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // enum: ["student", "mentor", "admin"],
      default: "",
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dhqucojwj/image/upload/v1743221336/uploads/srzkgvcfcy74gi3epbb6.jpg",
    },
    bio: {
      type: String,
      default: "This user has not set a bio yet.",
    },
    studentProfile: {
      skills: [
        {
          name: String,
          proficiency: Number,
          yearsOfExperience: Number,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          graduationYear: Number,
        },
      ],
      socialMedia: [
        {
          github: {
            url: String,
          },
          leetcode: {
            url: String,
          },
          linkedIn: {
            url: String,
          },
        },
      ],
      isProfileComplete: {
        type: Boolean,
        default: false,
      },
      assignedMentor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      }],
      requestedMentor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      }]
    },
    followers:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
     
    }],
    following:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    }],
    posts:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Post"
    }],
    mentorSchema: [
      {
        companyName: String,
        description: String,
        qualifications: [String],
        experience: String,
        skills: [String],
        projects: [String],
        contact: String,
        portfolio: String,
        studentAssigned: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        requests:[{
          type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         
        }]
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);