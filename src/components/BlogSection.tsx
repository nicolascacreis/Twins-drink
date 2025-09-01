import { BancadasSelector } from '@/components/BancadasSelector';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export const BlogSection = () => {
  return (
    <section id="blog" className="py-16 sm:py-24 section-professional">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex items-baseline justify-center mb-6">
            <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-3 mt-1" />
            <h2 className="section-title text-professional text-2xl sm:text-3xl lg:text-4xl">Bancadas Disponíveis</h2>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-professional-muted font-light max-w-4xl mx-auto leading-relaxed">
            Conheça nossos diferentes estilos de bancadas para criar o ambiente perfeito para seu evento
          </p>
        </div>

        {/* Bancadas Preview Carousel */}
        {/* Bancadas Selector Carousel */}
        <BancadasSelector />

        {/* CTA */}
        <div className="text-center professional-card p-8 sm:p-16 rounded-2xl border border-border">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-professional mb-4 sm:mb-6 tracking-wide">
            Confira nossa agenda disponível!
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-professional-muted font-light mb-6 sm:mb-10">
            Veja as datas disponíveis e solicite seu orçamento personalizado
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/agenda'}
            className="btn-professional text-white hover:bg-primary/90 font-normal tracking-wider px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-professional w-full sm:w-auto"
          >
            Ver Agenda Disponível
          </Button>
        </div>
      </div>
    </section>
  );
};