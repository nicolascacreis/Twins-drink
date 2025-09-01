import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { AnimatedSection } from '@/components/AnimatedSection';

interface Bancada {
  id: string;
  nome: string;
  descricao: string;
  caracteristicas: string[];
  estilo: string;
  cor: string;
  imagem: string;
}

interface BancadaCardProps {
  bancada: Bancada;
  isSelected?: boolean;
  showSelection?: boolean;
  onSelect?: (bancadaId: string) => void;
  cardStyle: React.CSSProperties;
  isActive: boolean;
}

export const BancadaCard = ({ 
  bancada, 
  isSelected, 
  showSelection, 
  onSelect, 
  cardStyle,
  isActive 
}: BancadaCardProps) => {
  const handleSelect = () => {
    if (showSelection && onSelect) {
      onSelect(bancada.id);
    }
  };

  return (
    <div
      className="absolute transition-all duration-500 ease-in-out"
      style={cardStyle}
    >
      <AnimatedSection animation="scale-in" className="w-full">
        <Card 
          className={`professional-card overflow-hidden cursor-pointer bg-card border-border transition-all duration-300 w-80 rounded-2xl hover-lift ${
            showSelection && isSelected 
              ? 'ring-4 ring-primary shadow-glow border-primary' 
              : 'hover:shadow-elegant'
          } ${isActive ? 'hover:scale-105' : ''}`}
          onClick={handleSelect}
        >
          {/* Header com cor da bancada */}
          <div className={`${bancada.cor} text-white p-4 relative`}>
            {showSelection && isSelected && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-md">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            )}
            <h4 className="font-bold text-lg text-center">
              {bancada.nome}
            </h4>
            <p className="text-center text-sm opacity-90 mt-1">
              {bancada.estilo}
            </p>
          </div>

          {/* Imagem real da bancada */}
          <div className="relative h-64 overflow-hidden">
            <LazyImage
              src={bancada.imagem}
              alt={`Bancada ${bancada.nome} - ${bancada.estilo}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
            {showSelection && isSelected && (
              <div className="absolute inset-0 bg-primary/10" />
            )}
          </div>

          <CardContent className="p-6 bg-card/95 backdrop-blur-sm">
            <p className="text-sm text-card-foreground mb-4 leading-relaxed">
              {bancada.descricao}
            </p>

            <div className="space-y-3">
              <Badge 
                variant="outline" 
                className={`text-xs px-3 py-1 ${bancada.cor} text-white border-0 animate-fade-in`}
              >
                {bancada.estilo}
              </Badge>
              
              <div className="space-y-2">
                {bancada.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                  <div key={index} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-card-foreground leading-relaxed">
                      {caracteristica}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {showSelection && (
              <Button 
                type="button"
                className={`btn-professional w-full mt-4 text-sm transition-all duration-300 ${
                  isSelected 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-primary text-white hover:bg-primary/90 hover-lift'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect();
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionada
                  </>
                ) : (
                  'Selecionar Esta Bancada'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};