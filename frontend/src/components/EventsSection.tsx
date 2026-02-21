import { useState } from 'react';
import { useGetPastEvents, useGetUpcomingEvents, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, ExternalLink, Pencil } from 'lucide-react';
import EventForm from './EventForm';
import type { Event } from '../backend';

export default function EventsSection() {
  const { data: pastEvents = [], isLoading: loadingPast } = useGetPastEvents();
  const { data: upcomingEvents = [], isLoading: loadingUpcoming } = useGetUpcomingEvents();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isPastEvent, setIsPastEvent] = useState(false);

  const handleAddEvent = (isPast: boolean) => {
    setIsPastEvent(isPast);
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsPastEvent(event.isPast);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section id="events" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-events.dim_128x128.png" 
              alt="Events" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Events</h2>
              <p className="text-muted-foreground">Our journey of innovation</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Upcoming Events</h3>
              {isAdmin && (
                <Button onClick={() => handleAddEvent(false)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.poster && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={event.poster.getDirectURL()}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span>{event.name}</span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    {event.registrationLink && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Register Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {upcomingEvents.length === 0 && !loadingUpcoming && (
              <div className="text-center py-12 text-muted-foreground">
                No upcoming events at the moment. Check back soon!
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Past Events</h3>
              {isAdmin && (
                <Button onClick={() => handleAddEvent(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              )}
            </div>

            <div className="space-y-8">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="md:flex">
                    {event.photos.length > 0 && (
                      <div className="md:w-1/3 bg-muted">
                        <img
                          src={event.photos[0].getDirectURL()}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(event.date)}
                          </div>
                        </div>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      {event.outcomes && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Outcomes</h4>
                          <p className="text-sm text-muted-foreground">{event.outcomes}</p>
                        </div>
                      )}
                      {event.photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {event.photos.slice(1, 5).map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo.getDirectURL()}
                              alt={`${event.name} ${idx + 2}`}
                              className="aspect-square object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pastEvents.length === 0 && !loadingPast && (
              <div className="text-center py-12 text-muted-foreground">
                No past events recorded yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          isPast={isPastEvent}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
