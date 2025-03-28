import React from 'react';

import { Calendar, GitBranch, Mail, User } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';



const ProjectDetails = ({ project, onClose, open }) => {
  const navigate = useNavigate();

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/project/${project._id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">{project.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Mentor</p>
                <p className="font-medium">{project.mentorId.name}</p>
                <a
                  href={`mailto:${project.mentorId.email}`}
                  className="text-primary hover:underline flex items-center gap-1 text-sm"
                >
                  <Mail size={14} />
                  {project.mentorId.email}
                </a>
              </div>
            </div>

            {project.gitRepoLink && (
              <div className="flex items-center gap-2">
                <GitBranch className="text-muted-foreground" size={20} />
                <div>
                  <p className="text-sm text-muted-foreground">Repository</p>
                  <a
                    href={project.gitRepoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {project.gitRepoLink}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.studentId.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Students</h3>
              <div className="space-y-2">
                {project.studentId.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">{student.name}</span>
                    <Button variant="link" asChild>
                      <a href={`mailto:${student.email}`}>
                        {student.email}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleViewFullDetails}>
              View Full Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDetails;