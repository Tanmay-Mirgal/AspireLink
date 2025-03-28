import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["Full-time","Internship"],
    },
    mentorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    appliedStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    jobDescription:{
        type:String,
        required:true
    },
    skillsRequired:[{
        type:String,
    }],
    jobLocation:{
        type:String,
        required:true
    },
    jobTitle:{
        type:String,
        required:true
    },

})

export const Job = mongoose.model("Job",jobSchema)