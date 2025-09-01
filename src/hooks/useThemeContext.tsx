import { createContext, useContext, useEffect, ReactNode } from 'react';

type ThemeType = 'default' | 'bronze' | 'prata' | 'ouro' | 'diamante';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'default',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  selectedPacote?: string;
}

export function ThemeProvider({ children, selectedPacote }: ThemeProviderProps) {
  const setTheme = (theme: ThemeType) => {
    // Ensure smooth theme transitions on mobile
    document.documentElement.style.transition = 'all 0.3s ease-in-out';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Reset transition after theme application
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

  useEffect(() => {
    if (selectedPacote) {
      setTheme(selectedPacote as ThemeType);
    } else {
      setTheme('default');
    }
  }, [selectedPacote]);

  const currentTheme = (selectedPacote as ThemeType) || 'default';

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}