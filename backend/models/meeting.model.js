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
  }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
