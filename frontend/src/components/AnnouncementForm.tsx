import { useState, useEffect } from 'react';
import { usePostAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, usePublishAnnouncement } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Eye } from 'lucide-react';
import type { Announcement } from '../backend';
import { toast } from 'sonner';

interface AnnouncementFormProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export default function AnnouncementForm({ announcement, onClose }: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const postAnnouncement = usePostAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const publishAnnouncement = usePublishAnnouncement();

  const categories = ['Meeting notice', 'Event update', 'Opportunity alert'];

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setCategory(announcement.category);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (announcement) {
        await updateAnnouncement.mutateAsync({
          id: announcement.id,
          title: title.trim(),
          content: content.trim(),
          category,
        });
        toast.success('Announcement updated successfully');
      } else {
        const newId = await postAnnouncement.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          category,
        });
        await publishAnnouncement.mutateAsync(newId);
        toast.success('Announcement posted successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save announcement');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!announcement || !confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await deleteAnnouncement.mutateAsync(announcement.id);
      toast.success('Announcement deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete announcement');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!announcement) return;

    try {
      await publishAnnouncement.mutateAsync(announcement.id);
      toast.success('Announcement published successfully');
    } catch (error) {
      toast.error('Failed to publish announcement');
      console.error(error);
    }
  };

  const isPending = postAnnouncement.isPending || updateAnnouncement.isPending || deleteAnnouncement.isPending || publishAnnouncement.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{announcement ? 'Edit Announcement' : 'Post Announcement'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
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
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter announcement content"
              rows={6}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            {announcement && (
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
                {!announcement.isPublic && (
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
              ) : announcement ? (
                'Update'
              ) : (
                'Post'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
