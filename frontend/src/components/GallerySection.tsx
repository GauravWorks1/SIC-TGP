import { useState } from 'react';
import { useGetAllPublicGalleryImages, useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X } from 'lucide-react';
import GalleryUploadForm from './GalleryUploadForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function GallerySection() {
  const { data: images = [], isLoading } = useGetAllPublicGalleryImages();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Workshops', 'Hackathons', 'Guest Lectures', 'Competitions', 'Field Visits'];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-gallery.dim_128x128.png" 
              alt="Gallery" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Image Gallery</h2>
              <p className="text-muted-foreground">Moments that inspire</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Image
            </Button>
          )}
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
                onClick={() => setSelectedImage(image.image.getDirectURL())}
              >
                <img
                  src={image.image.getDirectURL()}
                  alt={image.caption || image.category}
                  className="w-full h-full object-cover"
                />
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              No images in this category yet. {isAdmin && 'Upload your first image!'}
            </div>
          )}
        </Tabs>
      </div>

      {showForm && <GalleryUploadForm onClose={() => setShowForm(false)} />}

      {selectedImage && (
        <Dialog open onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
