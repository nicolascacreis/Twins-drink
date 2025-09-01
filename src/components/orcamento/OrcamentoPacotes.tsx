import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Star, Crown, Gem } from 'lucide-react';

interface Pacote {
  id: string;
  nome: string;
  subtitulo: string;
  preco: number;
  precoMenos50?: number;
  descricao: string;
  detalhes: string[];
  icon: JSX.Element;
  cor: string;
  minConvidados: number;
}

interface OrcamentoPacotesProps {
  pacotes: Pacote[];
  pacoteSelecionado: string;
  onSelectPacote: (id: string) => void;
}

export function OrcamentoPacotes({ pacotes, pacoteSelecionado, onSelectPacote }: OrcamentoPacotesProps) {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-background via-background/95 to-muted/30 transition-all duration-1000 ease-in-out">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="inline-block">
              <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-500">
                Nossos Pacotes
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground transition-all duration-500 px-2">
              Escolha a <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent transition-all duration-500">Experiência Perfeita</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-500 px-2">
              Drinks personalizados, ingredientes premium e bartenders especializados para tornar seu evento inesquecível
            </p>
          </div>

          {/* Pacotes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {pacotes.map((pacote, index) => (
              <Card 
                key={pacote.id}
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-[1.02] ${
                  pacoteSelecionado === pacote.id 
                    ? 'ring-4 ring-primary shadow-[0_0_40px_0_hsl(var(--primary)_/_0.4)] scale-[1.05] bg-gradient-to-br from-primary/10 to-primary/20' 
                    : 'hover:shadow-primary/20'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => onSelectPacote(pacote.id)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 transition-opacity duration-700 ${
                  pacoteSelecionado === pacote.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
                
                {/* Selection Glow Effect */}
                {pacoteSelecionado === pacote.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30 animate-pulse" />
                )}
                
                {/* Header with Icon */}
                <div className={`${pacote.cor} text-white p-4 sm:p-5 lg:p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
                        {pacote.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-center text-base sm:text-lg tracking-wide leading-tight">{pacote.nome}</h3>
                    <p className="text-center text-xs sm:text-sm opacity-95 font-medium">{pacote.subtitulo}</p>
                  </div>
                </div>
                
                <CardContent className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-muted/30 relative">
                  {/* Pricing */}
                  <div className="text-center mb-4 sm:mb-6">
                    {pacote.preco > 0 ? (
                      <div className="space-y-2">
                        {pacote.precoMenos50 ? (
                          <div className="space-y-1">
                            <div className="text-xl sm:text-2xl font-bold text-foreground">
                              R$ {pacote.preco.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">50+ convidados</div>
                            <div className="border-t border-border/30 pt-1">
                              <div className="text-lg sm:text-xl font-semibold text-primary">
                                R$ {pacote.precoMenos50.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">menos de 50 convidados</div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl font-bold text-foreground">
                              R$ {pacote.preco.toFixed(2)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">por pessoa</div>
                            {pacote.minConvidados > 0 && (
                              <div className="text-xs text-muted-foreground">
                                mín. {pacote.minConvidados} convidados
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-lg sm:text-xl font-semibold text-foreground">
                        {pacote.descricao}
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  {pacote.preco > 0 && (
                    <div className="text-center mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                        {pacote.descricao}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3">
                    {pacote.detalhes.map((detalhe, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{detalhe}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selection Indicator */}
                  {pacoteSelecionado === pacote.id && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2 shadow-lg">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}