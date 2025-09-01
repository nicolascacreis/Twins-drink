import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BancadaCard } from './BancadaCard';

interface Bancada {
  id: string;
  nome: string;
  descricao: string;
  caracteristicas: string[];
  estilo: string;
  cor: string;
  imagem: string;
}

interface BancadaCarouselProps {
  bancadas: Bancada[];
  selectedBancada?: string;
  onSelectBancada?: (bancadaId: string) => void;
  showSelection?: boolean;
}

export const BancadaCarousel = ({ 
  bancadas, 
  selectedBancada, 
  onSelectBancada, 
  showSelection 
}: BancadaCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (bancadaId: string) => {
    if (showSelection && onSelectBancada) {
      onSelectBancada(bancadaId);
    }
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % bancadas.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + bancadas.length) % bancadas.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const totalCards = bancadas.length;
    
    // Normalizar a diferença para o range [-totalCards/2, totalCards/2]
    let normalizedDiff = diff;
    if (diff > totalCards / 2) {
      normalizedDiff = diff - totalCards;
    } else if (diff < -totalCards / 2) {
      normalizedDiff = diff + totalCards;
    }

    const isActive = normalizedDiff === 0;
    const absDistance = Math.abs(normalizedDiff);
    
    // Ocultar bancadas muito distantes
    if (absDistance > 1) {
      return {
        transform: 'translateX(0) scale(0.7)',
        opacity: 0,
        zIndex: 0,
        display: 'none'
      };
    }

    if (isActive) {
      return {
        transform: 'translateX(0) scale(1)',
        opacity: 1,
        zIndex: 10,
        display: 'block'
      };
    }

    // Para bancadas adjacentes (-1 ou +1)
    const translateX = normalizedDiff > 0 ? '65%' : '-65%';
    
    return {
      transform: `translateX(${translateX}) scale(0.8)`,
      opacity: 0.4,
      zIndex: 5,
      display: 'block'
    };
  };

  return (
    <div className="relative mt-8">
      {/* Left Arrow */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-card/90 backdrop-blur-sm border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground h-12 w-12 rounded-full transition-all duration-300 shadow-lg"
        onClick={prevSlide}
        aria-label="Bancada anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Right Arrow */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-card/90 backdrop-blur-sm border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground h-12 w-12 rounded-full transition-all duration-300 shadow-lg"
        onClick={nextSlide}
        aria-label="Próxima bancada"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel Container */}
      <div className="relative h-[500px] max-w-5xl mx-auto flex items-center justify-center overflow-visible px-32">
        {bancadas.map((bancada, index) => {
          const cardStyle = getCardStyle(index);
          
          return (
            <BancadaCard
              key={bancada.id}
              bancada={bancada}
              isSelected={selectedBancada === bancada.id}
              showSelection={showSelection}
              onSelect={(bancadaId) => {
                setActiveIndex(index);
                handleSelect(bancadaId);
              }}
              cardStyle={cardStyle}
              isActive={index === activeIndex}
            />
          );
        })}
      </div>
    </div>
  );
};