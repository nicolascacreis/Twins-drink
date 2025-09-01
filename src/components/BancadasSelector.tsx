import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { BancadaCarousel } from './BancadaCarousel';
import { ImagePreloader } from './ImagePreloader';

interface Bancada {
  id: string;
  nome: string;
  descricao: string;
  caracteristicas: string[];
  estilo: string;
  cor: string;
  imagem: string;
}

interface BancadasSelectorProps {
  selectedBancada?: string;
  onSelectBancada?: (bancadaId: string) => void;
  showSelection?: boolean;
  restrictToBronze?: boolean;
}

export const BancadasSelector = ({ 
  selectedBancada, 
  onSelectBancada, 
  showSelection = false,
  restrictToBronze = false
}: BancadasSelectorProps) => {
  const allBancadas: Bancada[] = [
    {
      id: 'floral',
      nome: 'Bancada Floral',
      descricao: 'Elegante bancada decorada com flores e folhagens naturais, perfeita para eventos românticos',
      caracteristicas: [
        'Decoração com flores e folhagens frescas',
        'Base em madeira clara premium',
        'Estilo romântico e sofisticado',
        'Ideal para casamentos e eventos intimistas',
        'Setup personalizado incluso'
      ],
      estilo: 'Romântico & Natural',
      cor: 'bg-rose-500',
      imagem: '/lovable-uploads/ce50b610-eb98-4f61-ad53-ffee3dc9574e.png'
    },
    {
      id: 'rustico-branco',
      nome: 'Rústico Branco',
      descricao: 'Bar rústico com acabamento em madeira branca, clean e versátil para qualquer ocasião',
      caracteristicas: [
        'Madeira em tom branco envelhecido',
        'Design clean e moderno',
        'Versátil para diversos tipos de evento',
        'Acabamento refinado e durável',
        'Iluminação ambiente inclusa'
      ],
      estilo: 'Rústico Moderno',
      cor: 'bg-slate-400',
      imagem: '/lovable-uploads/bd122178-41e7-4ea3-9df0-aaca7ccdd8d1.png'
    },
    {
      id: 'rustico-preto',
      nome: 'Rústico Preto',
      descricao: 'Bar rústico com acabamento em madeira escura, elegante e marcante para eventos noturnos',
      caracteristicas: [
        'Madeira em tom escuro premium',
        'Visual marcante e elegante',
        'Perfeito para eventos noturnos',
        'Sofisticação e classe garantidas',
        'Detalhes em metal escovado'
      ],
      estilo: 'Rústico Elegante',
      cor: 'bg-gray-800',
      imagem: '/lovable-uploads/1d9de404-ff80-4d84-b6be-c3f804e253c5.png'
    },
    {
      id: 'captone',
      nome: 'Captone Premium',
      descricao: 'Bar com detalhes em captone, oferecendo um toque luxuoso e exclusivo ao seu evento',
      caracteristicas: [
        'Acabamento captone exclusivo',
        'Material premium e resistente',
        'Visual luxuoso e diferenciado',
        'Ideal para eventos VIP e corporativos',
        'Iluminação LED integrada'
      ],
      estilo: 'Luxuoso & Exclusivo',
      cor: 'bg-purple-600',
      imagem: '/lovable-uploads/672d0a54-1c80-4006-825c-d14b7ba20e04.png'
    },
    {
      id: 'bar-bolha',
      nome: 'Bar Bolha',
      descricao: 'Design inovador com efeito bolha iluminado, criando uma atmosfera única e moderna',
      caracteristicas: [
        'Efeito visual bolha único no mercado',
        'Iluminação LED colorida integrada',
        'Design futurista e inovador',
        'Chama atenção de todos os convidados',
        'Controle de cores personalizado'
      ],
      estilo: 'Futurista & Inovador',
      cor: 'bg-cyan-500',
      imagem: '/lovable-uploads/e4734815-2546-40e7-b191-341fef01ac9f.png'
    },
    {
      id: 'bar-ripado',
      nome: 'Bar Ripado',
      descricao: 'Acabamento ripado contemporâneo com iluminação especial, perfeito para eventos sofisticados',
      caracteristicas: [
        'Design ripado contemporâneo',
        'Iluminação ambiente sofisticada',
        'Visual moderno e elegante',
        'Perfeito para eventos corporativos',
        'Acabamento em madeira nobre'
      ],
      estilo: 'Contemporâneo & Sofisticado',
      cor: 'bg-amber-600',
      imagem: '/lovable-uploads/d3960c1c-877b-4ed1-9883-3ca36b0b2a57.png'
    }
  ];

  // Filtra bancadas baseado no plano selecionado
  const bancadas = restrictToBronze 
    ? allBancadas.filter(bancada => bancada.id === 'captone')
    : allBancadas;

  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-20 bg-background">
      {/* Preload all bancada images */}
      <ImagePreloader images={allBancadas.map(b => b.imagem)} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BancadaCarousel
          bancadas={bancadas}
          selectedBancada={selectedBancada}
          onSelectBancada={onSelectBancada}
          showSelection={showSelection}
        />
      </div>
    </section>
  );
};
