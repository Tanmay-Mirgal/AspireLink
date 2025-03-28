import React, { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProjectStore from '@/store/useProjectStore';
import ProjectCard from './components/ProjectCard';
import ProjectDetails from './components/ProjectDetails';

const ProjectsPage = () => {
  const { projects, isLoading, error, fetchProjects, fetchProjectById, selectedProject } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = async (projectId) => {
    setSelectedProjectId(projectId);
    await fetchProjectById(projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <Button onClick={() => fetchProjects()} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="container py-10 space-y-8 flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => handleProjectClick(project._id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProject && selectedProjectId && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          open={!!selectedProjectId}
        />
      )}
    </div>
  );
};

export default ProjectsPage;