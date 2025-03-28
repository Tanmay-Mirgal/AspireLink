import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  studentId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  passcode:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default:"pending",
    enum:["pending","started","finished"]
  },
  meetingRequests:[
    {
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      },
      status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
      },
      
    }
  ]
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
