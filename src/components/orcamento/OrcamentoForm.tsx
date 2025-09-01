import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Mail, Phone, MessageCircle, CheckCircle, Gem } from 'lucide-react';
import { BancadasSelector } from '@/components/BancadasSelector';

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

interface OrcamentoFormProps {
  formData: FormData;
  pacoteSelecionado: string;
  pacotes: Pacote[];
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OrcamentoForm({ formData, pacoteSelecionado, pacotes, onChange, onSubmit }: OrcamentoFormProps) {
  const pacoteEscolhido = pacotes.find(p => p.id === pacoteSelecionado);

  return (
    <section className="py-8 sm:py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-background via-background/95 to-muted/30 overflow-hidden">
            {/* Header */}
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <div className="inline-block mb-4">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium rounded-full">
                    Passo Final
                  </Badge>
                </div>
                <CardTitle className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
                  Seus <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dados</span>
                </CardTitle>
                <p className="text-base sm:text-xl text-muted-foreground font-light leading-relaxed px-2">
                  Preencha as informações para receber sua proposta personalizada
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-8 md:p-12">
              <form onSubmit={onSubmit} className="space-y-6 sm:space-y-10">
                {/* Dados Pessoais */}
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-2xl font-light text-foreground mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border/50">
                    Informações Pessoais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="nome" className="text-foreground font-medium text-sm sm:text-base">
                        Nome Completo *
                      </Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => onChange('nome', e.target.value)}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        E-mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="telefone" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      Telefone/WhatsApp *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => onChange('telefone', e.target.value)}
                      required
                      className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Dados do Evento */}
                <div className="space-y-6">
                  <h3 className="text-lg sm:text-2xl font-light text-foreground mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border/50">
                    Detalhes do Evento
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="evento" className="text-foreground font-medium text-sm sm:text-base">
                        Tipo de Evento *
                      </Label>
                      <Input
                        id="evento"
                        value={formData.evento}
                        onChange={(e) => onChange('evento', e.target.value)}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Casamento, Aniversário..."
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="convidados" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        Número de Convidados *
                      </Label>
                      <Input
                        id="convidados"
                        type="number"
                        min="1"
                        value={formData.convidados}
                        onChange={(e) => onChange('convidados', e.target.value)}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: 150"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="data" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        Data do Evento *
                      </Label>
                      <Input
                        id="data"
                        type="date"
                        value={formData.data}
                        onChange={(e) => onChange('data', e.target.value)}
                        required
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="horario" className="text-foreground font-medium text-sm sm:text-base">
                        Horário
                      </Label>
                      <Input
                        id="horario"
                        value={formData.horario}
                        onChange={(e) => onChange('horario', e.target.value)}
                        className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: 14:00 - 18:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="local" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      Local do Evento
                    </Label>
                    <Input
                      id="local"
                      value={formData.local}
                      onChange={(e) => onChange('local', e.target.value)}
                      className="h-12 sm:h-14 text-base sm:text-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="Endereço ou nome do local"
                    />
                  </div>
                </div>

                {/* Pacote Selecionado */}
                {pacoteEscolhido && (
                  <div className="space-y-4">
                    <Label className="text-foreground font-medium text-base">
                      Pacote Selecionado
                    </Label>
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          {pacoteEscolhido.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{pacoteEscolhido.nome}</p>
                          <p className="text-sm text-muted-foreground">{pacoteEscolhido.subtitulo}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{pacoteEscolhido.descricao}</p>
                    </div>
                  </div>
                )}

                {/* Seleção de Bancada */}
                {pacoteSelecionado !== 'diamante' && (
                  <div className="space-y-6">
                    <h3 className="text-lg sm:text-2xl font-light text-foreground mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border/50">
                      Escolha sua Bancada
                    </h3>
                    
                    <div className="text-center space-y-4">
                      {formData.bancada ? (
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-foreground font-medium">
                            Bancada: {formData.bancada.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      ) : (
                      <p className="text-muted-foreground text-base sm:text-lg px-2">
                        Clique para visualizar e escolher o estilo da bancada
                      </p>
                      )}
                      
                      <BancadasSelector 
                        selectedBancada={formData.bancada}
                        onSelectBancada={(bancadaId) => onChange('bancada', bancadaId)}
                        showSelection={true}
                        restrictToBronze={pacoteSelecionado === 'bronze'}
                      />
                    </div>
                  </div>
                )}


                {/* Pacote Diamante Special */}
                {pacoteSelecionado === 'diamante' && (
                  <div className="space-y-6">
                    <div className="text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 p-8 rounded-2xl border border-primary/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
                          <Gem className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-light text-foreground mb-4">
                          Pacote <span className="font-semibold">Diamante</span>
                        </h4>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                          Experiência totalmente personalizada e exclusiva. Criamos cada detalhe especialmente para seu evento, incluindo bar temático e elementos únicos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Observações */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="observacoes" className="text-foreground font-medium text-sm sm:text-base flex items-center gap-2">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      Observações Adicionais
                    </Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => onChange('observacoes', e.target.value)}
                      className="min-h-24 sm:min-h-32 text-base sm:text-lg resize-none border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="Conte-nos mais sobre seu evento, preferências específicas, temas, etc."
                    />
                  </div>

                {/* Submit Button */}
                <div className="text-center pt-6 sm:pt-8">
                  {!pacoteSelecionado ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        ⚠️ Selecione um pacote acima para continuar
                      </p>
                      <Button 
                        type="button"
                        size="lg"
                        disabled={true}
                        className="bg-muted text-muted-foreground cursor-not-allowed px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-medium tracking-wide w-full sm:w-auto"
                      >
                        Selecione um Pacote Primeiro
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="submit"
                      size="lg"
                      onClick={() => console.log('Button clicked, pacoteSelecionado:', pacoteSelecionado)}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white hover:scale-105 transition-all duration-300 px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-medium tracking-wide shadow-xl w-full sm:w-auto"
                    >
                      {pacoteSelecionado === 'diamante' ? 'Solicitar Orçamento Personalizado' : 'Calcular Orçamento'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}