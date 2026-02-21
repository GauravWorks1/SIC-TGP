import { useState, useEffect } from 'react';
import { useAddAchievement, useUpdateAchievement, useRemoveAchievement, usePublishAchievement } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Eye } from 'lucide-react';
import type { Achievement } from '../backend';
import { toast } from 'sonner';

interface AchievementFormProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementForm({ achievement, onClose }: AchievementFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [recipients, setRecipients] = useState('');

  const addAchievement = useAddAchievement();
  const updateAchievement = useUpdateAchievement();
  const removeAchievement = useRemoveAchievement();
  const publishAchievement = usePublishAchievement();

  const categories = ['Student awards', 'Competition wins', 'Grants received', 'Research papers'];

  useEffect(() => {
    if (achievement) {
      setTitle(achievement.title);
      setCategory(achievement.category);
      setDescription(achievement.description);
      setDate(new Date(Number(achievement.date) / 1000000).toISOString().split('T')[0]);
      setRecipients(achievement.recipients);
    }
  }, [achievement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !description.trim() || !date || !recipients.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dateTimestamp = BigInt(new Date(date).getTime() * 1000000);

      if (achievement) {
        await updateAchievement.mutateAsync({
          id: achievement.id,
          title: title.trim(),
          category,
          description: description.trim(),
          date: dateTimestamp,
          recipients: recipients.trim(),
        });
        toast.success('Achievement updated successfully');
      } else {
        const newId = await addAchievement.mutateAsync({
          title: title.trim(),
          category,
          description: description.trim(),
          date: dateTimestamp,
          recipients: recipients.trim(),
        });
        await publishAchievement.mutateAsync(newId);
        toast.success('Achievement added successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save achievement');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!achievement || !confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await removeAchievement.mutateAsync(achievement.id);
      toast.success('Achievement deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete achievement');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!achievement) return;

    try {
      await publishAchievement.mutateAsync(achievement.id);
      toast.success('Achievement published successfully');
    } catch (error) {
      toast.error('Failed to publish achievement');
      console.error(error);
    }
  };

  const isPending = addAchievement.isPending || updateAchievement.isPending || removeAchievement.isPending || publishAchievement.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{achievement ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter achievement title"
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
              placeholder="Describe the achievement"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients *</Label>
            <Input
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="e.g., John Doe, Jane Smith"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            {achievement && (
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
                {!achievement.isPublic && (
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
              ) : achievement ? (
                'Update'
              ) : (
                'Add Achievement'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
