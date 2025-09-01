import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  X,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const Agenda = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se uma data é no passado
  const isDateDisabled = useCallback((date: Date): boolean => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return checkDate < today;
  }, []);

  // Manipula seleção de data
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      toast({
        title: "Data selecionada",
        description: `${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
      });
    }
  }, []);

  // Vai para página de orçamento
  const handleContinue = useCallback(async () => {
    if (!selectedDate) {
      toast({
        title: "Selecione uma data",
        description: "Escolha a data do seu evento antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Salva data no localStorage
      localStorage.setItem('selectedEventDate', selectedDate.toISOString());
      
      // Simula um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Redirecionando...",
        description: "Levando você para a página de orçamento.",
      });
      
      navigate('/orcamento');
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
      toast({
        title: "Erro",
        description: "Houve um problema. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, navigate]);

  // Limpa seleção
  const clearSelection = useCallback(() => {
    setSelectedDate(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">

        {/* Calendar Selection */}
        <section className="py-16 section-professional">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="professional-card p-8 rounded-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Calendar */}
                  <div>
                    <h3 className="text-2xl font-light text-professional mb-6 text-center flex items-baseline justify-center">
                      <CalendarIcon className="h-6 w-6 text-primary mr-2 mt-1" />
                      Escolha a Data
                    </h3>
                    <div className="flex justify-center w-full">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={isDateDisabled}
                        locale={ptBR}
                        className="rounded-xl border pointer-events-auto w-full max-w-sm mx-auto bg-card/50 backdrop-blur-sm shadow-professional"
                      />
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-professional-muted">
                      <p>Selecione qualquer data a partir de hoje</p>
                    </div>
                  </div>

                  {/* Selected Date Display */}
                  <div>
                    <h3 className="text-2xl font-light text-professional mb-6 text-center flex items-baseline justify-center">
                      <CheckCircle className="h-6 w-6 text-primary mr-2 mt-1" />
                      Data Selecionada
                    </h3>
                    
                    {selectedDate ? (
                      <div className="space-y-6">
                        {/* Selected Date Display */}
                        <div className="bg-primary/10 rounded-lg p-6 text-center">
                          <div className="flex items-baseline justify-center mb-4">
                            <CheckCircle className="h-6 w-6 text-primary mr-2 mt-1" />
                            <span className="text-xl font-light text-professional">
                              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-professional-muted mb-4">
                            {format(selectedDate, "EEEE", { locale: ptBR })}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSelection}
                            className="text-primary border-primary hover:bg-primary hover:text-white"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Alterar Seleção
                          </Button>
                        </div>

                        {/* Next Steps */}
                        <div className="text-center">
                          <p className="text-professional-muted mb-4">
                            Data selecionada! Clique em continuar para avançar.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-professional-muted py-12">
                        <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-light">
                          Selecione uma data no calendário para continuar
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div className="text-center p-8 bg-primary/5 rounded-2xl">
                    <h3 className="text-3xl md:text-4xl font-light text-professional mb-4 tracking-wide">
                      {selectedDate ? 'Data selecionada!' : 'Selecione uma data'}
                    </h3>
                    <p className="text-lg md:text-xl text-professional-muted font-light mb-8">
                      {selectedDate 
                        ? `${format(selectedDate, "dd/MM/yyyy")} - Vamos criar seu orçamento!`
                        : 'Escolha uma data para começar'
                      }
                    </p>
                    <Button 
                      size="lg" 
                      onClick={handleContinue}
                      disabled={!selectedDate || isLoading}
                      className={cn(
                        "btn-professional text-white font-normal tracking-wider px-6 py-3 text-base rounded-lg transition-all duration-300 w-full flex items-center justify-center",
                        selectedDate 
                          ? "hover:scale-105 hover:shadow-lg" 
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        "Processando..."
                      ) : (
                        <span className="flex items-center">
                          Continuar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Agenda;