import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Início', id: 'inicio' },
    { name: 'Sobre', id: 'about' },
    { name: 'Eventos', id: 'eventos' },
    { name: 'Blog', id: 'blog' }
  ];

  // Determine header visibility and style based on scroll and mobile
  const getHeaderClasses = () => {
    const baseClasses = "left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10 transition-all duration-500 ease-in-out";
    
    if (isMobile) {
      // Mobile: fixed header that hides on scroll down and shows on scroll up
      const visibilityClass =
        scrollDirection === 'down' && !isAtTop && !isMenuOpen
          ? '-translate-y-full'
          : 'translate-y-0';
      const backgroundClass = isAtTop && !isMenuOpen 
        ? 'bg-primary/80' 
        : 'bg-primary/95 shadow-lg';
      return `${baseClasses} fixed top-0 transform ${visibilityClass} ${backgroundClass} will-change-transform`;
    } else {
      // Desktop: fixed at top
      const backgroundClass = isAtTop 
        ? 'bg-primary/80' 
        : 'bg-primary/95 shadow-lg';
      return `${baseClasses} fixed top-0 ${backgroundClass}`;
    }
  };

  return (
    <header className={getHeaderClasses()}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300">
            <img 
              src="/lovable-uploads/eb380cca-838b-43ec-bfa7-bc6677ac5149.png" 
              alt="Twins Drinks Logo" 
              className="h-8 w-8 md:h-10 md:w-10 object-contain transition-all duration-300"
            />
            <span className="text-xl md:text-2xl font-light text-white tracking-wider transition-all duration-300">
              TWINS DRINKS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-white/70 transition-colors duration-300 font-light tracking-wide text-base"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* CTA Button */}
            <Link to="/agenda">
              <Button 
                size="lg" 
                className="btn-professional text-white hover:bg-primary/90 font-normal tracking-wider px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-professional"
              >
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

          {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-4 pb-6 space-y-3 bg-primary border-t border-white/10">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-light tracking-wide"
                >
                  {item.name}
                </button>
              ))}
              <Link 
                to="/agenda" 
                className="block w-full text-center px-8 py-3 mt-4 btn-professional text-white hover:bg-primary/90 rounded-lg transition-professional font-normal tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};