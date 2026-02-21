import { useState } from 'react';
import { useGetAllPublicAchievements, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trophy, Pencil } from 'lucide-react';
import AchievementForm from './AchievementForm';
import type { Achievement } from '../backend';

export default function AchievementsSection() {
  const { data: achievements = [], isLoading } = useGetAllPublicAchievements();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const sortedAchievements = [...achievements].sort((a, b) => Number(b.date - a.date));

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAchievement(null);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Student awards': 'bg-chart-1/10 text-chart-1',
      'Competition wins': 'bg-chart-2/10 text-chart-2',
      'Grants received': 'bg-chart-3/10 text-chart-3',
      'Research papers': 'bg-chart-4/10 text-chart-4',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <section id="achievements" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/icon-achievements.dim_128x128.png" 
              alt="Achievements" 
              className="h-16 w-16"
            />
            <div>
              <h2 className="text-4xl font-bold">Achievements</h2>
              <p className="text-muted-foreground">Celebrating excellence</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sortedAchievements.map((achievement) => (
            <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <Badge className={getCategoryColor(achievement.category)}>
                        {achievement.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{achievement.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(achievement.date)}
                    </p>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(achievement)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{achievement.description}</p>
                <div className="text-sm">
                  <span className="font-semibold">Recipients:</span> {achievement.recipients}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedAchievements.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No achievements recorded yet. {isAdmin && 'Add your first achievement!'}
          </div>
        )}
      </div>

      {showForm && (
        <AchievementForm
          achievement={editingAchievement}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}
