import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
// import twinsLogo from '@/assets/twins-logo.png';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16 transition-all duration-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/lovable-uploads/eb380cca-838b-43ec-bfa7-bc6677ac5149.png" 
                alt="Twins Drinks Logo" 
                className="h-8 w-8 md:h-10 md:w-10 object-contain transition-all duration-300"
              />
              <span className="text-white text-2xl md:text-3xl font-ultralight tracking-ultra-wide transition-all duration-300">
                TWINS DRINKS
              </span>
            </div>
            <p className="text-white/85 font-light leading-relaxed max-w-lg text-base md:text-lg">
              Transformando eventos em experiências memoráveis, somos especialistas em momentos únicos e sofisticados com a mixologia.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg md:text-xl font-normal tracking-wide mb-8">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-4 text-white/60 flex-shrink-0" />
                <span className="text-white/85 font-light text-base">(11) 94272-7822</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-4 text-white/60 flex-shrink-0" />
                <span className="text-white/85 font-light text-base">Twinsdrinkss@gmail.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-4 text-white/60 mt-1 flex-shrink-0" />
                <span className="text-white/85 font-light text-base">
                  São Paulo, SP<br />
                  Atendemos todo Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg md:text-xl font-normal tracking-wide mb-8">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/twinsdrinks9/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="http://linkedin.com/in/twins-drinks-eventos-e-festas-19421237a" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 font-light text-sm md:text-base">
              © Copyright 2025 - Twins Drinks - Todos os Direitos Reservados
            </p>
            <p className="text-white/70 font-light text-sm md:text-base mt-4 md:mt-0">
              Desenvolvido para experiências únicas e profissionais
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};