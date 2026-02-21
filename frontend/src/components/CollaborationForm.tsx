import { useState, useEffect } from 'react';
import { useAddCollaboration, useUpdateCollaboration, useRemoveCollaboration, usePublishCollaboration } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Eye } from 'lucide-react';
import type { Collaboration } from '../backend';
import { toast } from 'sonner';

interface CollaborationFormProps {
  collaboration: Collaboration | null;
  onClose: () => void;
}

export default function CollaborationForm({ collaboration, onClose }: CollaborationFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [internshipOpportunity, setInternshipOpportunity] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const addCollaboration = useAddCollaboration();
  const updateCollaboration = useUpdateCollaboration();
  const removeCollaboration = useRemoveCollaboration();
  const publishCollaboration = usePublishCollaboration();

  useEffect(() => {
    if (collaboration) {
      setCompanyName(collaboration.companyName);
      setProblemStatement(collaboration.problemStatement || '');
      setInternshipOpportunity(collaboration.internshipOpportunity || '');
      setContactInfo(collaboration.contactInfo || '');
    }
  }, [collaboration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error('Please enter company name');
      return;
    }

    try {
      if (collaboration) {
        await updateCollaboration.mutateAsync({
          id: collaboration.id,
          companyName: companyName.trim(),
          problemStatement: problemStatement.trim() || null,
          internshipOpportunity: internshipOpportunity.trim() || null,
          contactInfo: contactInfo.trim() || null,
        });
        toast.success('Collaboration updated successfully');
      } else {
        const newId = await addCollaboration.mutateAsync({
          companyName: companyName.trim(),
          problemStatement: problemStatement.trim() || null,
          internshipOpportunity: internshipOpportunity.trim() || null,
          contactInfo: contactInfo.trim() || null,
        });
        await publishCollaboration.mutateAsync(newId);
        toast.success('Collaboration added successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save collaboration');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!collaboration || !confirm('Are you sure you want to delete this collaboration?')) return;

    try {
      await removeCollaboration.mutateAsync(collaboration.id);
      toast.success('Collaboration deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete collaboration');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!collaboration) return;

    try {
      await publishCollaboration.mutateAsync(collaboration.id);
      toast.success('Collaboration published successfully');
    } catch (error) {
      toast.error('Failed to publish collaboration');
      console.error(error);
    }
  };

  const isPending = addCollaboration.isPending || updateCollaboration.isPending || removeCollaboration.isPending || publishCollaboration.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{collaboration ? 'Edit Collaboration' : 'Add Collaboration'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemStatement">Problem Statement</Label>
            <Textarea
              id="problemStatement"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the problem statement"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internshipOpportunity">Internship Opportunity</Label>
            <Textarea
              id="internshipOpportunity"
              value={internshipOpportunity}
              onChange={(e) => setInternshipOpportunity(e.target.value)}
              placeholder="Describe internship opportunities"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email or phone number"
            />
          </div>

          <DialogFooter className="gap-2">
            {collaboration && (
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
                {!collaboration.isPublic && (
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
              ) : collaboration ? (
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
