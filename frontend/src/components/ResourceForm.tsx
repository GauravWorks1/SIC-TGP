import { useState, useEffect } from 'react';
import { useAddResource, useUpdateResource, useRemoveResource, usePublishResource } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Eye } from 'lucide-react';
import type { Resource } from '../backend';
import { toast } from 'sonner';

interface ResourceFormProps {
  resource: Resource | null;
  onClose: () => void;
}

export default function ResourceForm({ resource, onClose }: ResourceFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const addResource = useAddResource();
  const updateResource = useUpdateResource();
  const removeResource = useRemoveResource();
  const publishResource = usePublishResource();

  const categories = ['Research papers', 'Learning links', 'Tools for students', 'Innovation guides'];

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setCategory(resource.category);
      setDescription(resource.description);
      setLink(resource.link);
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !description.trim() || !link.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (resource) {
        await updateResource.mutateAsync({
          id: resource.id,
          title: title.trim(),
          category,
          description: description.trim(),
          link: link.trim(),
        });
        toast.success('Resource updated successfully');
      } else {
        const newId = await addResource.mutateAsync({
          title: title.trim(),
          category,
          description: description.trim(),
          link: link.trim(),
        });
        await publishResource.mutateAsync(newId);
        toast.success('Resource added successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save resource');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!resource || !confirm('Are you sure you want to delete this resource?')) return;

    try {
      await removeResource.mutateAsync(resource.id);
      toast.success('Resource deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete resource');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!resource) return;

    try {
      await publishResource.mutateAsync(resource.id);
      toast.success('Resource published successfully');
    } catch (error) {
      toast.error('Failed to publish resource');
      console.error(error);
    }
  };

  const isPending = addResource.isPending || updateResource.isPending || removeResource.isPending || publishResource.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link *</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <DialogFooter className="gap-2">
            {resource && (
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
                {!resource.isPublic && (
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
              ) : resource ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
