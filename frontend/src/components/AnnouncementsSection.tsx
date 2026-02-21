import { useState } from 'react';
import { useGetAllPublicAnnouncements, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Megaphone, Pencil } from 'lucide-react';
import AnnouncementForm from './AnnouncementForm';
import type { Announcement } from '../backend';

export default function AnnouncementsSection() {
  const { data: announcements = [], isLoading } = useGetAllPublicAnnouncements();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const sortedAnnouncements = [...announcements].sort((a, b) => Number(b.timestamp - a.timestamp));

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryVariant = (category: string): "default" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      'Meeting notice': 'default',
      'Event update': 'secondary',
      'Opportunity alert': 'outline',
    };
    return variants[category] || 'default';
  };

  return (
    <section id="announcements" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-announcements.dim_128x128.png" 
              alt="Announcements" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Announcements</h2>
              <p className="text-muted-foreground">Stay updated</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Post Announcement
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone className="h-5 w-5 text-primary" />
                      <Badge variant={getCategoryVariant(announcement.category)}>
                        {announcement.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(announcement.timestamp)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedAnnouncements.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No announcements yet. {isAdmin && 'Post your first announcement!'}
          </div>
        )}
      </div>

      {showForm && (
        <AnnouncementForm
          announcement={editingAnnouncement}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
