import { useState } from 'react';
import { useGetAllPublicProjects, useGetMyProjects, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Pencil } from 'lucide-react';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import type { Project } from '../backend';

export default function ProjectShowcaseSection() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: publicProjects = [] } = useGetAllPublicProjects();
  const { data: myProjects = [] } = useGetMyProjects();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const canEdit = (project: Project) => {
    if (!identity) return false;
    return project.submittedBy.toString() === identity.getPrincipal().toString() || isAdmin;
  };

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-projects.dim_128x128.png" 
              alt="Projects" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Project Showcase</h2>
              <p className="text-muted-foreground">Innovation in action</p>
            </div>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Project
            </Button>
          )}
        </div>

        {myProjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">My Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    {!project.isPublic && (
                      <Badge variant="outline" className="w-fit">Pending Review</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Tech:</span> {project.techUsed}
                      </div>
                      <div>
                        <span className="font-semibold">Team:</span> {project.teamMembers}
                      </div>
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          View Demo
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold mb-6">All Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {canEdit(project) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Tech:</span> {project.techUsed}
                    </div>
                    <div>
                      <span className="font-semibold">Team:</span> {project.teamMembers}
                    </div>
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        View Demo
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {publicProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No projects showcased yet. {isAuthenticated && 'Be the first to submit!'}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ProjectSubmissionForm
          project={editingProject}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
