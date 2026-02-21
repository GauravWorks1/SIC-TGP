import { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Team', id: 'team' },
    { label: 'Events', id: 'events' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Projects', id: 'projects' },
    { label: 'Achievements', id: 'achievements' },
    { label: 'Resources', id: 'resources' },
    { label: 'Join Us', id: 'join' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/icon-innovation.dim_128x128.png" 
                alt="Innovation Icon" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">Student Innovation Council</h1>
                <p className="text-xs text-muted-foreground">Innovate • Create • Transform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <LoginButton />
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <LoginButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/assets/generated/icon-innovation.dim_128x128.png" 
                  alt="Innovation Icon" 
                  className="h-12 w-12"
                />
                <div>
                  <h3 className="font-bold text-lg">Student Innovation Council</h3>
                  <p className="text-sm text-muted-foreground">Empowering Innovation</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating a culture of innovation, research, and problem-solving among students.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {navItems.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-muted-foreground hover:text-foreground text-left transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4 mb-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiFacebook size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiX size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiLinkedin size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <SiInstagram size={20} />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Student Innovation Council
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
