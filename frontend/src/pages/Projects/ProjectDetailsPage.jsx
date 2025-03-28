import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Calendar, GitBranch, Mail, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProjectStore from '@/store/useProjectStore';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, fetchProjectById, isLoading, error } = useProjectStore();

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
    }
  }, [id, fetchProjectById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (error || !selectedProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">{error || 'Project not found'}</p>
          <Button onClick={() => navigate('/')} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="container flex items-center flex-col py-10">
        <Button
          variant="ghost"
          className="mb-6 -ml-4"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedProject.title}</h1>
            <p className="text-xl text-muted-foreground">{selectedProject.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <User className="text-muted-foreground" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Mentor</p>
                  <p className="font-medium text-lg">{selectedProject.mentorId.name}</p>
                  <a
                    href={`mailto:${selectedProject.mentorId.email}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail size={16} />
                    {selectedProject.mentorId.email}
                  </a>
                </div>
              </div>

              {selectedProject.gitRepoLink && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <GitBranch className="text-muted-foreground" size={24} />
                  <div>
                    <p className="text-sm text-muted-foreground">Repository</p>
                    <a
                      href={selectedProject.gitRepoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedProject.gitRepoLink}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Calendar className="text-muted-foreground" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {selectedProject.studentId.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Students</h2>
                  <div className="space-y-3">
                    {selectedProject.studentId.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-muted-foreground" />
                          <span className="font-medium">{student.name}</span>
                        </div>
                        <Button variant="link" asChild>
                          <a href={`mailto:${student.email}`}>
                            <Mail size={16} className="mr-2" />
                            {student.email}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;