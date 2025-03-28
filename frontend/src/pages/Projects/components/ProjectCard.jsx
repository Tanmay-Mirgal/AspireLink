import React from 'react';

import { Calendar, GitBranch, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';



const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="group relative bg-card text-card-foreground rounded-lg border shadow-sm transition-all hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
          <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{project.studentId.length} Students</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

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

        <div className="flex justify-between items-center pt-4">
          {project.gitRepoLink && (
            <a
              href={project.gitRepoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <GitBranch size={16} />
              Repository
            </a>
          )}
          <Button onClick={onClick} variant="secondary">View Details</Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;