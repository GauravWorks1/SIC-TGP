import { Lightbulb, Users, Rocket, Target } from 'lucide-react';

export default function AboutSection() {
  const missions = [
    { icon: Lightbulb, text: 'Promote student research' },
    { icon: Users, text: 'Connect students with industry problems' },
    { icon: Rocket, text: 'Conduct innovation events' },
    { icon: Target, text: 'Support startup ideas' },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <img 
            src="/assets/generated/icon-innovation.dim_128x128.png" 
            alt="Innovation" 
            className="h-16 w-16"
          />
          <div>
            <h2 className="text-4xl font-bold">About Us</h2>
            <p className="text-muted-foreground">Driving innovation and excellence</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create a culture of innovation, research, and problem-solving among students.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <div className="grid gap-4">
              {missions.map((mission, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <mission.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">{mission.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
