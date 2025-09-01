
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const slide = {
    image: '/lovable-uploads/0f5e49c8-2160-4fdb-830a-750bdbc2ca74.png',
    title: 'Seja o evento que for,',
    subtitle: 'estamos prontos para atendê-lo',
    description: 'Experiência única em bar de eventos com mais de 3 anos de mercado'
  };

  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const elementPosition = aboutSection.offsetTop - 80;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-black" role="banner" aria-label="Hero Section">
      {/* Background Image with Heavy Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {/* Desktop Image Layer */}
          <div
            className="hidden sm:block absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              filter: 'brightness(0.6) contrast(1.1)'
            }}
          />
          {/* Mobile Image Layer */}
          <div
            className="block sm:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/lovable-uploads/c831a79e-ee4a-4c5f-9fe8-3152abcdbb38.png)',
              filter: 'brightness(0.6) contrast(1.1)'
            }}
          />
          {/* Balanced Dark Overlays */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        </div>
      </div>

      {/* Content - High Z-Index to Stay Above Everything */}
      <div className="relative z-40 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="hero-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 sm:mb-6 tracking-wide leading-tight drop-shadow-2xl">
            {slide.title}
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-6 sm:mb-8 tracking-wide leading-tight drop-shadow-2xl">
            {slide.subtitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-8 sm:mb-12 font-light tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-xl">
            {slide.description}
          </p>
          <Button 
            size="lg" 
            onClick={scrollToAbout}
            className="btn-professional text-white hover:bg-primary/90 font-normal tracking-wider px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-professional w-full sm:w-auto shadow-2xl animate-pulse-glow hover:animate-none"
          >
            Conheça mais
          </Button>
        </div>
      </div>

    </section>
  );
};
