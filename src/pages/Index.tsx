import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { EventsSection } from '@/components/EventsSection';
import { AboutSection } from '@/components/AboutSection';
import { CommitmentSection } from '@/components/CommitmentSection';
import { BlogSection } from '@/components/BlogSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <EventsSection />
      <AboutSection />
      <CommitmentSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
