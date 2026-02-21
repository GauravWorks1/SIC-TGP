import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import EventsSection from './components/EventsSection';
import GallerySection from './components/GallerySection';
import ProjectShowcaseSection from './components/ProjectShowcaseSection';
import AchievementsSection from './components/AchievementsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import CollaborationSection from './components/CollaborationSection';
import ResourcesSection from './components/ResourcesSection';
import JoinUsSection from './components/JoinUsSection';
import ContactSection from './components/ContactSection';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Layout>
        <ProfileSetupModal />
        <HeroSection />
        <AboutSection />
        <TeamSection />
        <EventsSection />
        <GallerySection />
        <ProjectShowcaseSection />
        <AchievementsSection />
        <AnnouncementsSection />
        <CollaborationSection />
        <ResourcesSection />
        <JoinUsSection />
        <ContactSection />
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
