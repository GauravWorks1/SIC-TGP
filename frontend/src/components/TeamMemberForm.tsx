import { useState, useEffect } from 'react';
import { useAddTeamMember, useUpdateTeamMember, useRemoveTeamMember, usePublishTeamMember } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, Trash2, Eye } from 'lucide-react';
import { ExternalBlob } from '../backend';
import type { TeamMember } from '../backend';
import { toast } from 'sonner';

interface TeamMemberFormProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function TeamMemberForm({ member, onClose }: TeamMemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addMember = useAddTeamMember();
  const updateMember = useUpdateTeamMember();
  const removeMember = useRemoveTeamMember();
  const publishMember = usePublishTeamMember();

  const roles = ['Faculty coordinator', 'Student president', 'Core member', 'Volunteer'];

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setDepartment(member.department);
      if (member.photo) {
        setPhotoPreview(member.photo.getDirectURL());
      }
    }
  }, [member]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role || !department.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let photoBlob: ExternalBlob | null = null;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (member?.photo) {
        photoBlob = member.photo;
      }

      if (member) {
        await updateMember.mutateAsync({
          id: member.id,
          name: name.trim(),
          role,
          department: department.trim(),
          photo: photoBlob,
        });
        toast.success('Team member updated successfully');
      } else {
        const newId = await addMember.mutateAsync({
          name: name.trim(),
          role,
          department: department.trim(),
          photo: photoBlob,
        });
        await publishMember.mutateAsync(newId);
        toast.success('Team member added successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save team member');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!member || !confirm('Are you sure you want to delete this team member?')) return;

    try {
      await removeMember.mutateAsync(member.id);
      toast.success('Team member deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete team member');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!member) return;

    try {
      await publishMember.mutateAsync(member.id);
      toast.success('Team member published successfully');
    } catch (error) {
      toast.error('Failed to publish team member');
      console.error(error);
    }
  };

  const isPending = addMember.isPending || updateMember.isPending || removeMember.isPending || publishMember.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="flex-1"
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="text-sm text-muted-foreground">
                Upload progress: {uploadProgress}%
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {member && (
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
                {!member.isPublic && (
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
              ) : member ? (
                'Update'
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
