import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone } from 'lucide-react';

export function OrcamentoPriceTable() {
  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-muted/30 to-background transition-all duration-1000 ease-in-out">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabela de Preços */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden transition-all duration-700 hover:shadow-[0_0_30px_0_hsl(var(--primary)_/_0.2)]">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-primary/5 to-secondary/5 transition-all duration-500">
              <CardTitle className="text-3xl font-light tracking-tight transition-all duration-500">
                Investimento por <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Pacote</span>
              </CardTitle>
              <p className="text-muted-foreground text-lg transition-all duration-500">
                Valores baseados em 170 convidados como referência
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="overflow-x-auto overflow-hidden rounded-lg border border-border/50">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 transition-all duration-300">
                      <TableHead className="font-semibold text-foreground transition-all duration-300 text-xs sm:text-sm">Pacote</TableHead>
                      <TableHead className="font-semibold text-foreground transition-all duration-300 text-xs sm:text-sm">Descrição</TableHead>
                      <TableHead className="text-center font-semibold text-foreground transition-all duration-300 text-xs sm:text-sm">Valor/Pessoa</TableHead>
                      <TableHead className="text-center font-semibold text-foreground transition-all duration-300 text-xs sm:text-sm">Total (170)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/20 transition-all duration-300 hover:shadow-lg">
                      <TableCell>
                        <Badge className="plano-bronze text-white border-0 px-3 py-1 transition-all duration-300">BRONZE</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground transition-all duration-300 text-xs sm:text-sm">6 drinks do cardápio</TableCell>
                      <TableCell className="text-center font-semibold text-sm sm:text-lg transition-all duration-300">
                        <div className="text-xs sm:text-sm">R$ 29,99 (50+)</div>
                        <div className="text-xs text-muted-foreground">R$ 39,99 (menos de 50)</div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-sm sm:text-lg text-primary transition-all duration-300">R$ 5.098</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/20 transition-all duration-300 hover:shadow-lg">
                      <TableCell>
                        <Badge className="plano-prata text-white border-0 px-3 py-1 transition-all duration-300">PRATA</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground transition-all duration-300 text-xs sm:text-sm">10 drinks - tudo incluso</TableCell>
                      <TableCell className="text-center font-semibold text-sm sm:text-lg transition-all duration-300">
                        <div className="text-xs sm:text-sm">R$ 35,00 (50+)</div>
                        <div className="text-xs text-muted-foreground">R$ 49,99 (menos de 50)</div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-sm sm:text-lg text-primary transition-all duration-300">R$ 5.950</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/20 transition-all duration-300 hover:shadow-lg">
                      <TableCell>
                        <Badge className="plano-ouro text-white border-0 px-3 py-1 transition-all duration-300">OURO</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground transition-all duration-300 text-xs sm:text-sm">Completo + chope</TableCell>
                      <TableCell className="text-center font-semibold text-sm sm:text-lg transition-all duration-300">
                        <div className="text-xs sm:text-sm">R$ 59,99 (50+)</div>
                        <div className="text-xs text-muted-foreground">R$ 69,99 (menos de 50)</div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-sm sm:text-lg text-primary transition-all duration-300">R$ 10.198</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    Formas de Pagamento
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>💳 Cartão de crédito - até 6x sem juros</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>💳 Cartão de débito</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>📱 PIX</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span><strong>💰 À vista: 5% de desconto</strong></span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl border border-border/50">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Smartphone className="h-5 w-5 text-secondary" />
                    </div>
                    Condições de Pagamento
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div>
                        <strong className="text-foreground">Reserva (40%)</strong>
                        <p className="text-muted-foreground">Na assinatura do contrato</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div>
                        <strong className="text-foreground">Saldo (60%)</strong>
                        <p className="text-muted-foreground">No dia do evento</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}