import { Project } from "../models/project.model.js";


export const createProject = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            mentorId, 
            studentId, 
            gitRepoLink, 
            technologies 
        } = req.body;

        // Validate input
        if (!title || !description || !mentorId) {
            return res.status(400).json({
                message: "Title, description, and mentor are required"
            });
        }

        // Create new project
        const newProject = new Project({
            title,
            description,
            mentorId,
            studentId: studentId || [],
            gitRepoLink: gitRepoLink || '',
            technologies: technologies || [],
            status: 'pending'
        });

        // Save project
        const savedProject = await newProject.save();

        res.status(201).json({
            message: "Project created successfully",
            project: savedProject
        });
    } catch (error) {
        console.error("Create project error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export const getAllProject = async (req, res) => {
    try {
        
        const projects = await Project.find()
            .populate('mentorId', 'name email')
            .populate('studentId', 'name email');

        if (projects.length === 0) {
            return res.status(404).json({
                message: "No projects found"
            });
        }

        res.status(200).json({
            message: "Projects retrieved successfully",
            projects
        });
    } catch (error) {
        console.error("Get all projects error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getProjectById = async (req,res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId).populate('mentorId', 'name email').populate('studentId', 'name email');
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        res.status(200).json({
            message: "Project details retrieved successfully",
            project
        });
        
    } catch (error) {
        console.error("Get project by id error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
        
    }
}