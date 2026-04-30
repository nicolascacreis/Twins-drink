import { Heart } from 'lucide-react';
import { Link } from "react-router-dom"; // Importante para a navegação
import { Button } from '@/components/ui/button'; // Importe o componente de botão

export const CommitmentSection = () => {
  return (
    <section className="py-20 bg-gradient-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-baseline justify-center mb-6">
            <Heart className="h-8 w-8 text-white mr-3 mt-1" />
            <h2 className="section-title text-white">Nosso Compromisso</h2>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white">
            Nossa missão é transformar cada evento em uma experiência memorável, oferecendo serviços de bartender personalizados, com criatividade, profissionalismo e atenção a todos os detalhes. Cada serviço é formalizado por contrato, garantindo segurança e transparência para nossos clientes.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 md:p-12">
            <p className="text-lg font-light leading-relaxed text-white/90 mb-6">
              Além disso, todos os anos realizamos dois sorteios com tudo incluso, oferecendo a pessoas que não têm condições a oportunidade de ter um bar completo em sua festa, proporcionando momentos inesquecíveis.
            </p>
            
            <p className="text-xl font-normal text-white tracking-wide mb-10">
              Com qualidade, dedicação e propósito, queremos que cada celebração seja única e significativa, encantando convidados e tornando cada evento especial.
            </p>

            {/* O BOTÃO QUE ESTAVA FALTANDO ENTRA AQUI */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-2xl font-light text-white mb-2">Confira nossa agenda disponível!</h3>
              <p className="text-white/70 mb-6">Veja as datas disponíveis e solicite seu orçamento personalizado</p>
              
              <Link to="/agenda">
                <Button 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10 text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
                >
                  Ver Agenda Disponível
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
