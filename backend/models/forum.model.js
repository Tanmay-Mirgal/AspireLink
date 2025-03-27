import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({

  topic: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

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

forumSchema.methods.joinForum = function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    return this.save();
  }
  return this;
};

const Forum = mongoose.model('Forum', forumSchema);

export default Forum;