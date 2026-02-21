import { useState, useEffect } from 'react';
import { useSubmitProject, useUpdateProject, useDeleteProject, usePublishProject } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Eye } from 'lucide-react';
import type { Project } from '../backend';
import { toast } from 'sonner';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface ProjectSubmissionFormProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectSubmissionForm({ project, onClose }: ProjectSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techUsed, setTechUsed] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [demoLink, setDemoLink] = useState('');

  const submitProject = useSubmitProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const publishProject = usePublishProject();
  const { data: isAdmin = false } = useIsCallerAdmin();

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setTechUsed(project.techUsed);
      setTeamMembers(project.teamMembers);
      setDemoLink(project.demoLink || '');
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !techUsed.trim() || !teamMembers.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          title: title.trim(),
          description: description.trim(),
          techUsed: techUsed.trim(),
          teamMembers: teamMembers.trim(),
          demoLink: demoLink.trim() || null,
        });
        toast.success('Project updated successfully');
      } else {
        await submitProject.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          techUsed: techUsed.trim(),
          teamMembers: teamMembers.trim(),
          demoLink: demoLink.trim() || null,
        });
        toast.success('Project submitted successfully! Awaiting admin approval.');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save project');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject.mutateAsync(project.id);
      toast.success('Project deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!project) return;

    try {
      await publishProject.mutateAsync(project.id);
      toast.success('Project published successfully');
    } catch (error) {
      toast.error('Failed to publish project');
      console.error(error);
    }
  };

  const isPending = submitProject.isPending || updateProject.isPending || deleteProject.isPending || publishProject.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Submit Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techUsed">Technologies Used *</Label>
            <Input
              id="techUsed"
              value={techUsed}
              onChange={(e) => setTechUsed(e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamMembers">Team Members *</Label>
            <Input
              id="teamMembers"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="e.g., John Doe, Jane Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoLink">Demo Link (optional)</Label>
            <Input
              id="demoLink"
              type="url"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <DialogFooter className="gap-2">
            {project && (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                {isAdmin && !project.isPublic && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePublish}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Publish
                  </Button>
                )}
              </>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : project ? (
                'Update'
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
