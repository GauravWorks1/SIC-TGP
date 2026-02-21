import { useState, useEffect } from 'react';
import { useCreateEvent, useUpdateEvent, useDeleteEvent, usePublishEvent } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Trash2, Eye, X } from 'lucide-react';
import { ExternalBlob } from '../backend';
import type { Event } from '../backend';
import { toast } from 'sonner';

interface EventFormProps {
  event: Event | null;
  isPast: boolean;
  onClose: () => void;
}

export default function EventForm({ event, isPast: initialIsPast, onClose }: EventFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [isPast, setIsPast] = useState(initialIsPast);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const publishEvent = usePublishEvent();

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(new Date(Number(event.date) / 1000000).toISOString().split('T')[0]);
      setDescription(event.description);
      setOutcomes(event.outcomes || '');
      setRegistrationLink(event.registrationLink || '');
      setIsPast(event.isPast);
      if (event.poster) {
        setPosterPreview(event.poster.getDirectURL());
      }
      if (event.photos.length > 0) {
        setPhotoPreviews(event.photos.map(p => p.getDirectURL()));
      }
    }
  }, [event]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files);
    
    const previews = files.map(file => {
      const reader = new FileReader();
      return new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setPhotoPreviews);
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dateTimestamp = BigInt(new Date(date).getTime() * 1000000);
      
      let photoBlobs: ExternalBlob[] = [];
      if (photoFiles.length > 0) {
        photoBlobs = await Promise.all(
          photoFiles.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            return ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
          })
        );
      } else if (event?.photos) {
        photoBlobs = event.photos;
      }

      let posterBlob: ExternalBlob | null = null;
      if (posterFile) {
        const arrayBuffer = await posterFile.arrayBuffer();
        posterBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
      } else if (event?.poster) {
        posterBlob = event.poster;
      }

      if (event) {
        await updateEvent.mutateAsync({
          id: event.id,
          name: name.trim(),
          date: dateTimestamp,
          description: description.trim(),
          photos: photoBlobs,
          outcomes: outcomes.trim() || null,
          registrationLink: registrationLink.trim() || null,
          poster: posterBlob,
          isPast,
        });
        toast.success('Event updated successfully');
      } else {
        const newId = await createEvent.mutateAsync({
          name: name.trim(),
          date: dateTimestamp,
          description: description.trim(),
          photos: photoBlobs,
          outcomes: outcomes.trim() || null,
          registrationLink: registrationLink.trim() || null,
          poster: posterBlob,
          isPast,
        });
        await publishEvent.mutateAsync(newId);
        toast.success('Event created successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save event');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteEvent.mutateAsync(event.id);
      toast.success('Event deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete event');
      console.error(error);
    }
  };

  const handlePublish = async () => {
    if (!event) return;

    try {
      await publishEvent.mutateAsync(event.id);
      toast.success('Event published successfully');
    } catch (error) {
      toast.error('Failed to publish event');
      console.error(error);
    }
  };

  const isPending = createEvent.isPending || updateEvent.isPending || deleteEvent.isPending || publishEvent.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter event name"
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event"
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPast"
              checked={isPast}
              onCheckedChange={setIsPast}
            />
            <Label htmlFor="isPast">This is a past event</Label>
          </div>

          {isPast ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="outcomes">Outcomes</Label>
                <Textarea
                  id="outcomes"
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                  placeholder="What were the outcomes of this event?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Event Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                />
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {photoPreviews.map((preview, idx) => (
                      <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="aspect-square object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <Input
                  id="registrationLink"
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poster">Event Poster</Label>
                <Input
                  id="poster"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                />
                {posterPreview && (
                  <img src={posterPreview} alt="Poster preview" className="w-full max-w-xs rounded mt-2" />
                )}
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            {event && (
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
                {!event.isPublic && (
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
              ) : event ? (
                'Update'
              ) : (
                'Create Event'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
