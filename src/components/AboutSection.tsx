import { Coffee } from 'lucide-react';

export const AboutSection = () => {
  // Calculate years since founding (August 2022)
  const currentYear = new Date().getFullYear();
  const foundingYear = 2022;
  const yearsInBusiness = currentYear - foundingYear;

  const stats = [
    { number: yearsInBusiness.toString(), label: 'ANOS' },
    { number: '+200', label: 'EVENTOS REALIZADOS' },
    { number: '+12 MIL', label: 'CLIENTES ATENDIDOS' }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 section-professional">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-baseline justify-center mb-4 sm:mb-6">
            <Coffee className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mr-2 sm:mr-3 mt-1 flex-shrink-0" />
            <h2 className="section-title text-professional text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">História</h2>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
          <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed text-professional mb-6 sm:mb-8 lg:mb-12 italic max-w-5xl mx-auto px-2">
            "A Twins Drinks nasceu em agosto de 2022, idealizada por sua CEO, Bartender e Mixologista atuante no mercado desde 2009. Com mais de 200 eventos realizados em todo o Brasil, nossa marca se destaca pelo atendimento diferenciado, inovação e pela busca constante em superar expectativas oferecendo experiências únicas que começam já nas degustações."
          </blockquote>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-professional-muted font-light max-w-3xl mx-auto px-2">
            Venha degustar e tirar suas próprias conclusões sobre os nossos serviços, 
            será uma grande honra ter sua festa em nossos cases de sucesso!!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="professional-card p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl border border-border group hover:shadow-xl transition-all duration-300">
                <div className="stats-number text-professional mb-1 sm:mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-500 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-wider">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base tracking-wider text-professional-muted font-light break-words">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};