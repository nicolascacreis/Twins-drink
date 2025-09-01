import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface Bancada {
  id: string;
  nome: string;
  descricao: string;
  estilo: string;
  cor: string;
  imagem: string;
}

export const BancadasPreview = () => {
  const bancadas: Bancada[] = [
    {
      id: 'floral',
      nome: 'Bancada Floral',
      descricao: 'Elegante bancada decorada com flores e folhagens naturais',
      estilo: 'Romântico & Natural',
      cor: 'bg-rose-500',
      imagem: '/lovable-uploads/ce50b610-eb98-4f61-ad53-ffee3dc9574e.png'
    },
    {
      id: 'rustico-branco',
      nome: 'Rústico Branco',
      descricao: 'Bar rústico com acabamento em madeira branca',
      estilo: 'Rústico Moderno',
      cor: 'bg-slate-400',
      imagem: '/lovable-uploads/bd122178-41e7-4ea3-9df0-aaca7ccdd8d1.png'
    },
    {
      id: 'rustico-preto',
      nome: 'Rústico Preto',
      descricao: 'Bar rústico com acabamento em madeira escura',
      estilo: 'Rústico Elegante',
      cor: 'bg-gray-800',
      imagem: '/lovable-uploads/1d9de404-ff80-4d84-b6be-c3f804e253c5.png'
    },
    {
      id: 'captone',
      nome: 'Captone Premium',
      descricao: 'Bar com detalhes em captone luxuoso',
      estilo: 'Luxuoso & Exclusivo',
      cor: 'bg-purple-600',
      imagem: '/lovable-uploads/672d0a54-1c80-4006-825c-d14b7ba20e04.png'
    },
    {
      id: 'bar-bolha',
      nome: 'Bar Bolha',
      descricao: 'Design inovador com efeito bolha iluminado',
      estilo: 'Futurista & Inovador',
      cor: 'bg-cyan-500',
      imagem: '/lovable-uploads/e4734815-2546-40e7-b191-341fef01ac9f.png'
    },
    {
      id: 'bar-ripado',
      nome: 'Bar Ripado',
      descricao: 'Acabamento ripado contemporâneo com iluminação',
      estilo: 'Contemporâneo & Sofisticado',
      cor: 'bg-amber-600',
      imagem: '/lovable-uploads/d3960c1c-877b-4ed1-9883-3ca36b0b2a57.png'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {bancadas.map((bancada) => (
            <CarouselItem key={bancada.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="professional-card border-primary overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-secondary">
                {/* Header com cor da bancada */}
                <div className={`${bancada.cor} text-white p-3`}>
                  <h4 className="font-bold text-sm text-center truncate">
                    {bancada.nome}
                  </h4>
                  <p className="text-center text-xs opacity-90 mt-1 truncate">
                    {bancada.estilo}
                  </p>
                </div>

                {/* Imagem da bancada */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={bancada.imagem}
                    alt={bancada.nome}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                </div>

                <CardContent className="p-4 bg-secondary">
                  <p className="text-xs text-white leading-relaxed line-clamp-2 mb-3">
                    {bancada.descricao}
                  </p>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 mt-3 ${bancada.cor} text-white border-0`}
                  >
                    {bancada.estilo}
                  </Badge>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6 bg-secondary border-primary text-white hover:bg-primary" />
        <CarouselNext className="hidden sm:flex -right-4 lg:-right-6 bg-secondary border-primary text-white hover:bg-primary" />
      </Carousel>
      
      {/* Indicadores para mobile */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex space-x-2">
          {bancadas.map((_, index) => (
            <div key={index} className="h-2 w-2 bg-primary rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};