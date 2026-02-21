import { useState } from 'react';
import { useGetAllPublicResources, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink, Pencil, BookOpen } from 'lucide-react';
import ResourceForm from './ResourceForm';
import type { Resource } from '../backend';

export default function ResourcesSection() {
  const { data: resources = [], isLoading } = useGetAllPublicResources();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const categories = ['Research papers', 'Learning links', 'Tools for students', 'Innovation guides'];

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const groupedResources = categories.map(category => ({
    category,
    items: resources.filter(r => r.category === category),
  }));

  return (
    <section id="resources" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-resources.dim_128x128.png" 
              alt="Resources" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Resources</h2>
              <p className="text-muted-foreground">Tools for your innovation journey</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          )}
        </div>

        <div className="space-y-12">
          {groupedResources.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                {category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(resource)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Access Resource
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {items.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  No resources in this category yet.
                </p>
              )}
            </div>
          ))}
        </div>

        {resources.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No resources yet. {isAdmin && 'Add your first resource!'}
          </div>
        )}
      </div>

      {showForm && (
        <ResourceForm
          resource={editingResource}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
