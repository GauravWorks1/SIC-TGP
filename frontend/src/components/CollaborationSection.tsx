import { useState } from 'react';
import { useGetAllPublicCollaborations, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Handshake, Pencil } from 'lucide-react';
import CollaborationForm from './CollaborationForm';
import type { Collaboration } from '../backend';

export default function CollaborationSection() {
  const { data: collaborations = [], isLoading } = useGetAllPublicCollaborations();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingCollaboration, setEditingCollaboration] = useState<Collaboration | null>(null);

  const handleEdit = (collaboration: Collaboration) => {
    setEditingCollaboration(collaboration);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCollaboration(null);
  };

  return (
    <section id="collaboration" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-collaboration.dim_128x128.png" 
              alt="Collaboration" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Industry Collaboration</h2>
              <p className="text-muted-foreground">Bridging academia and industry</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Collaboration
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborations.map((collaboration) => (
            <Card key={collaboration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Handshake className="h-5 w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-xl">{collaboration.companyName}</CardTitle>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(collaboration)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {collaboration.problemStatement && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Problem Statement</h4>
                    <p className="text-sm text-muted-foreground">{collaboration.problemStatement}</p>
                  </div>
                )}
                {collaboration.internshipOpportunity && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Internship Opportunity</h4>
                    <p className="text-sm text-muted-foreground">{collaboration.internshipOpportunity}</p>
                  </div>
                )}
                {collaboration.contactInfo && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Contact</h4>
                    <p className="text-sm text-muted-foreground">{collaboration.contactInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {collaborations.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No collaborations yet. {isAdmin && 'Add your first collaboration!'}
          </div>
        )}
      </div>

      {showForm && (
        <CollaborationForm
          collaboration={editingCollaboration}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
