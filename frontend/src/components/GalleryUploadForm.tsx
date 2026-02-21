import { useState } from 'react';
import { useUploadGalleryImage, usePublishGalleryImage } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface GalleryUploadFormProps {
  onClose: () => void;
}

export default function GalleryUploadForm({ onClose }: GalleryUploadFormProps) {
  const [category, setCategory] = useState('');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = useUploadGalleryImage();
  const publishImage = usePublishGalleryImage();

  const categories = ['Workshops', 'Hackathons', 'Guest Lectures', 'Competitions', 'Field Visits'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !imageFile) {
      toast.error('Please select a category and image');
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const newId = await uploadImage.mutateAsync({
        category,
        image: imageBlob,
        caption: caption.trim() || null,
      });

      await publishImage.mutateAsync(newId);
      toast.success('Image uploaded successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    }
  };

  const isPending = uploadImage.isPending || publishImage.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full rounded mt-2" />
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="text-sm text-muted-foreground">
                Upload progress: {uploadProgress}%
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
