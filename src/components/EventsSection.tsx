import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wine } from 'lucide-react';

export const EventsSection = () => {
  const events = [
    {
      title: 'Casamentos',
      image: '/lovable-uploads/f66f9473-0f16-4e60-932a-fc90b892dd0d.png',
      description: 'Momentos únicos com drinks especiais para celebrar o amor'
    },
    {
      title: 'Aniversários',
      image: '/lovable-uploads/0001a77c-6454-48dd-b604-043c49971067.png',
      description: 'Comemore mais um ano de vida com sabores inesquecíveis'
    },
    {
      title: 'Eventos Corporativos',
      image: '/lovable-uploads/9081fbda-4fcf-4518-a61f-4baff1828dc3.png',
      description: 'Profissionalismo e sofisticação para seus eventos empresariais'
    }
  ];

  return (
    <section id="eventos" className="py-16 sm:py-20 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex items-baseline justify-center mb-6">
            <Wine className="h-6 w-6 sm:h-8 sm:w-8 text-white mr-3 mt-1" />
            <h2 className="section-title text-white text-2xl sm:text-3xl lg:text-4xl">Eventos</h2>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/85 font-light max-w-4xl mx-auto leading-relaxed">
            Transformamos qualquer ocasião em uma experiência única com nossos serviços especializados de bar
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {events.map((event, index) => (
            <Card 
              key={index} 
              className="professional-card border-0 overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white mb-2 tracking-wide">
                    {event.title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <p className="text-professional-muted font-light leading-relaxed text-sm sm:text-base md:text-lg">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/agenda">
            <Button 
              size="lg" 
              className="btn-professional text-white hover:bg-primary/90 font-normal tracking-wider px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-professional w-full sm:w-auto"
            >
              Solicitar Orçamento
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};