import { useState } from 'react';
import { useGetAllPublicTeamMembers, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import TeamMemberForm from './TeamMemberForm';
import { Badge } from '@/components/ui/badge';
import type { TeamMember } from '../backend';

export default function TeamSection() {
  const { data: teamMembers = [], isLoading } = useGetAllPublicTeamMembers();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const roleOrder = ['Faculty coordinator', 'Student president', 'Core member', 'Volunteer'];
  const sortedMembers = [...teamMembers].sort((a, b) => {
    const aIndex = roleOrder.indexOf(a.role);
    const bIndex = roleOrder.indexOf(b.role);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (isLoading) {
    return (
      <section id="team" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading team members...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-team.dim_128x128.png" 
              alt="Team" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Our Team</h2>
              <p className="text-muted-foreground">Meet the people driving innovation</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {member.photo ? (
                  <img
                    src={member.photo.getDirectURL()}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="text-6xl font-bold text-primary">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                <p className="text-sm text-muted-foreground">{member.department}</p>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="flex-1 gap-1"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No team members yet. {isAdmin && 'Add your first team member!'}
          </div>
        )}
      </div>

      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
