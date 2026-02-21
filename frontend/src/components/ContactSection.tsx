import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground">
            Get in touch with us for any queries or collaborations
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a
                    href="mailto:innovation@university.edu"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    innovation@university.edu
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Faculty Coordinator</h3>
                  <p className="text-muted-foreground">Dr. John Smith</p>
                  <a
                    href="tel:+1234567890"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Office Location</h3>
                  <p className="text-muted-foreground">
                    Innovation Hub, Room 301
                    <br />
                    Main Campus Building
                    <br />
                    University Name
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Follow Us</h3>
                  <div className="flex gap-4 mt-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <SiFacebook size={24} />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <SiX size={24} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <SiLinkedin size={24} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <SiInstagram size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
