import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
  // Topic or skill the forum is about
  topic: {
    type: String,
    required: true,
    trim: true
  },

  // Description of the forum
  description: {
    type: String,
    trim: true
  },

  // Mentor who created the forum
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Members of the forum (students)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Messages in the forum
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to join a forum
forumSchema.methods.joinForum = function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    return this.save();
  }
  return this;
};

const Forum = mongoose.model('Forum', forumSchema);

export default Forum;