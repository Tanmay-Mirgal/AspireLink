import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    gitRepoLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                // Optional validation for GitHub/GitLab repository link
                return v === '' || /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\/[\w-]+\/[\w-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid repository link!`
        }
    },
    technologies: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);