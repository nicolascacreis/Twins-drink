import { Heart } from 'lucide-react';

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
            
            <p className="text-xl font-normal text-white tracking-wide">
              Com qualidade, dedicação e propósito, queremos que cada celebração seja única e significativa, encantando convidados e tornando cada evento especial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};