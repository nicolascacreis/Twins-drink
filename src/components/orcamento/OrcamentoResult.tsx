import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  Crown, 
  Star, 
  MessageCircle, 
  Eye,
  Sparkles,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { useEffect } from 'react';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  evento: string;
  data: string;
  horario: string;
  local: string;
  convidados: string;
  pacote: string;
  bancada: string;
  observacoes: string;
}

interface Pacote {
  id: string;
  nome: string;
  subtitulo: string;
  preco: number;
  descricao: string;
  detalhes: string[];
  icon: JSX.Element;
  cor: string;
  minConvidados: number;
}

interface OrcamentoResultProps {
  formData: FormData;
  pacoteSelecionado: string;
  pacotes: Pacote[];
  valorEstimado: number;
  onNovoOrcamento: () => void;
  onConfirmarWhatsApp: () => void;
}

export function OrcamentoResult({ 
  formData, 
  pacoteSelecionado, 
  pacotes, 
  valorEstimado, 
  onNovoOrcamento, 
  onConfirmarWhatsApp 
}: OrcamentoResultProps) {
  const pacoteEscolhido = pacotes.find(p => p.id === (formData.pacote || pacoteSelecionado));
  const numConvidados = parseInt(formData.convidados);
  
  // Rola para o topo quando o componente é montado
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (!pacoteEscolhido) return null;

  const inclusos = [
    { icon: <Star className="h-5 w-5" />, text: 'Bartenders profissionais especializados' },
    { icon: <CheckCircle className="h-5 w-5" />, text: 'Equipamentos e utensílios completos' },
    { icon: <Sparkles className="h-5 w-5" />, text: 'Cardápio personalizado de drinks' },
    { icon: <Crown className="h-5 w-5" />, text: 'Ingredientes premium selecionados' },
    { icon: <CheckCircle className="h-5 w-5" />, text: 'Montagem e desmontagem do bar' },
    { icon: <Star className="h-5 w-5" />, text: 'Atendimento durante todo o evento' }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background min-h-screen">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Success */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 mt-8 sm:mt-12 lg:mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 sm:mb-6 lg:mb-8 shadow-xl">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full mb-2 sm:mb-3 lg:mb-4">
                Orçamento Pronto
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground px-2">
                Proposta <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Calculada</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed px-2">
                Olá <strong className="text-foreground font-semibold">{formData.nome}</strong>, sua proposta está pronta!
              </p>
            </div>
          </div>

          {/* Valor Principal */}
          <Card className="mb-8 sm:mb-10 lg:mb-12 border-0 shadow-2xl overflow-hidden mx-2 sm:mx-0">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-secondary via-muted to-card text-white p-4 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10">
                  <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8">
                    <div className="p-2 sm:p-4 bg-white/20 rounded-full backdrop-blur-sm">
                      <DollarSign className="h-8 w-8 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light opacity-90">Investimento Total</h2>
                      <p className="text-xs sm:text-base lg:text-lg opacity-80">Para seu evento perfeito</p>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-light tracking-wide mb-4 sm:mb-6 text-center">
                    {valorEstimado > 0 ? (
                      `R$ ${valorEstimado.toLocaleString('pt-BR')}`
                    ) : (
                      'Valor sob consulta'
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-base lg:text-lg opacity-90">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Users className="h-3 w-3 sm:h-5 sm:w-5" />
                      <span>{formData.convidados} convidados</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Crown className="h-3 w-3 sm:h-5 sm:w-5" />
                      <span className="truncate max-w-[150px] sm:max-w-[200px] text-center">{pacoteEscolhido?.nome}</span>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-8 border-t border-white/20">
                    <p className="text-xs sm:text-sm opacity-80 px-2">
                      *Valor sujeito a alterações conforme detalhes finais do evento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12 mx-2 sm:mx-0">
            
            {/* Dados do Evento */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-foreground">Detalhes do Evento</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-1 text-sm sm:text-base">Tipo de Evento</p>
                    <p className="text-muted-foreground capitalize text-base sm:text-lg">{formData.evento}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-1 flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      Data do Evento
                    </p>
                    <p className="text-muted-foreground text-base sm:text-lg">
                      {new Date(formData.data).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  {formData.horario && (
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2 text-sm sm:text-base">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        Horário
                      </p>
                      <p className="text-muted-foreground text-base sm:text-lg">{formData.horario}</p>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-1 flex items-center gap-2 text-sm sm:text-base">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      Convidados
                    </p>
                    <p className="text-muted-foreground text-base sm:text-lg">{formData.convidados} pessoas</p>
                  </div>
                  
                  {formData.local && (
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2 text-sm sm:text-base">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        Local
                      </p>
                      <p className="text-muted-foreground text-base sm:text-lg break-words">{formData.local}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Pacote Selecionado */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-foreground">Pacote Escolhido</h3>
                </div>

                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="bg-gradient-to-r from-secondary/5 to-primary/5 p-4 sm:p-5 lg:p-6 rounded-lg border-l-4 border-secondary">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="mt-1">
                        {pacoteEscolhido?.icon}
                      </div>
                      <h4 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
                        {pacoteEscolhido?.nome}
                      </h4>
                    </div>
                    <p className="text-muted-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
                      {pacoteEscolhido?.subtitulo}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-foreground mb-3 sm:mb-4">
                      {pacoteEscolhido?.descricao}
                    </p>
                    {pacoteEscolhido?.preco && pacoteEscolhido.preco > 0 ? (
                      <div className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground">
                        R$ {pacoteEscolhido.preco.toFixed(2)} 
                        <span className="text-xs sm:text-sm text-muted-foreground block sm:inline"> por pessoa</span>
                      </div>
                    ) : (
                      <div className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground">
                        Valor sob consulta
                      </div>
                    )}
                  </div>
                  
                  {formData.bancada && (
                    <div className="bg-gradient-to-r from-secondary/5 to-primary/5 p-3 sm:p-4 rounded-lg border-l-4 border-secondary">
                      <p className="font-semibold text-foreground mb-2 text-sm sm:text-base">Bancada Escolhida</p>
                      <p className="text-muted-foreground capitalize text-base sm:text-lg">
                        {formData.bancada.replace('-', ' ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Inclusos */}
          <Card className="mb-8 sm:mb-10 lg:mb-12 border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 mx-2 sm:mx-0">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-primary/20 rounded-lg border border-primary/30">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-foreground">Inclusos no Seu Pacote</h3>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  Tudo que você precisa para um evento memorável
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                {inclusos.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-4 bg-gradient-to-br from-primary/10 to-primary/5 p-3 sm:p-5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <div className="text-primary mt-0.5 sm:mt-1 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-foreground leading-relaxed font-medium text-xs sm:text-base">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Botões de Ação */}
          <div className="text-center px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
              <Button 
                onClick={onNovoOrcamento}
                variant="outline"
                size="lg"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-light border-2 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm w-full sm:w-auto"
              >
                <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Novo Orçamento
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto"
                onClick={onConfirmarWhatsApp}
              >
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Confirmar via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
