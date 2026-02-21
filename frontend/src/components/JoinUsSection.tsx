import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyRegistration, useSubmitRegistration } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinUsSection() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: existingRegistration } = useGetMyRegistration();
  const submitRegistration = useSubmitRegistration();

  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [skills, setSkills] = useState('');
  const [interestArea, setInterestArea] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !branch.trim() || !year.trim() || !skills.trim() || !interestArea.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await submitRegistration.mutateAsync({
        name: name.trim(),
        branch: branch.trim(),
        year: year.trim(),
        skills: skills.trim(),
        interestArea: interestArea.trim(),
      });
      toast.success('Registration submitted successfully!');
      setName('');
      setBranch('');
      setYear('');
      setSkills('');
      setInterestArea('');
    } catch (error) {
      toast.error('Failed to submit registration');
      console.error(error);
    }
  };

  return (
    <section id="join" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UserPlus className="h-12 w-12 text-primary" />
              <h2 className="text-4xl font-bold">Join Us</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Be part of our innovation community and shape the future
            </p>
          </div>

          {!isAuthenticated ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-6">
                    Please login to register with the Student Innovation Council
                  </p>
                  <Button onClick={login} size="lg" className="gap-2">
                    <UserPlus className="h-5 w-5" />
                    Login to Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : existingRegistration ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  Registration Submitted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    Thank you for your interest! Your registration has been submitted and is currently under review.
                    We'll get back to you soon.
                  </AlertDescription>
                </Alert>
                <div className="mt-6 space-y-3 text-sm">
                  <div>
                    <span className="font-semibold">Name:</span> {existingRegistration.name}
                  </div>
                  <div>
                    <span className="font-semibold">Branch:</span> {existingRegistration.branch}
                  </div>
                  <div>
                    <span className="font-semibold">Year:</span> {existingRegistration.year}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className="capitalize">{existingRegistration.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch/Department *</Label>
                      <Input
                        id="branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g., 2nd Year"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills *</Label>
                    <Textarea
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="List your technical and soft skills"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestArea">Area of Interest *</Label>
                    <Textarea
                      id="interestArea"
                      value={interestArea}
                      onChange={(e) => setInterestArea(e.target.value)}
                      placeholder="What areas of innovation interest you?"
                      rows={3}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitRegistration.isPending}>
                    {submitRegistration.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
