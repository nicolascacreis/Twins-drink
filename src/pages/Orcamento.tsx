import { useState, useEffect } from 'react';
import { Award, Star, Crown, Gem } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { OrcamentoPacotes } from '@/components/orcamento/OrcamentoPacotes';
import { OrcamentoPriceTable } from '@/components/orcamento/OrcamentoPriceTable';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import { OrcamentoResult } from '@/components/orcamento/OrcamentoResult';
import { ThemeProvider } from '@/hooks/useThemeContext';

export default function Orcamento() {
  const { toast } = useToast();
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [pacoteSelecionado, setPacoteSelecionado] = useState('');
  const [valorEstimado, setValorEstimado] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    evento: '',
    data: '',
    horario: '',
    local: '',
    convidados: '',
    pacote: '',
    bancada: '',
    observacoes: ''
  });

  // Carrega a data e bancada selecionadas da agenda
  useEffect(() => {
    const selectedEventDate = localStorage.getItem('selectedEventDate');
    const selectedBancada = localStorage.getItem('selectedBancada');
    
    if (selectedEventDate) {
      const date = new Date(selectedEventDate);
      setFormData(prev => ({
        ...prev,
        data: format(date, 'yyyy-MM-dd')
      }));
    }

    if (selectedBancada) {
      setFormData(prev => ({
        ...prev,
        bancada: selectedBancada
      }));
    }
  }, []);

  const pacotes = [
    {
      id: 'bronze',
      nome: 'PACOTE BRONZE',
      subtitulo: 'ACESSÍVEL E ENCANTADOR',
      preco: 29.99,
      precoMenos50: 39.99,
      descricao: '6 drinks do cardápio',
      detalhes: [
        'Bar móvel incluso',
        'Cardápio personalizado',
        'Ideal para mini weddings e eventos mais intimistas'
      ],
      icon: <Award className="h-6 w-6" />,
      cor: 'plano-bronze',
      minConvidados: 50
    },
    {
      id: 'prata',
      nome: 'PACOTE PRATA',
      subtitulo: 'QUALIDADE COM ÓTIMO CUSTO-BENEFÍCIO',
      preco: 35.00,
      precoMenos50: 49.99,
      descricao: '10 drinks do cardápio - tudo incluso',
      detalhes: [
        'Bar móvel incluso',
        'Bebidas premium',
        'Perfeito para eventos que buscam equilíbrio entre preço e sofisticação'
      ],
      icon: <Star className="h-6 w-6" />,
      cor: 'plano-prata',
      minConvidados: 50
    },
    {
      id: 'ouro',
      nome: 'PACOTE OURO',
      subtitulo: 'COMPLETO E SOFISTICADO',
      preco: 59.99,
      precoMenos50: 69.99,
      descricao: 'Cardápio completo + chope com chopeira',
      detalhes: [
        'Locação da chopeira e garçom inclusos',
        'Copos de cristal',
        'Cristaleira e detalhe de cristal personalizado',
        'Ideal para festas elegantes e exigentes'
      ],
      icon: <Crown className="h-6 w-6" />,
      cor: 'plano-ouro',
      minConvidados: 50
    },
    {
      id: 'diamante',
      nome: 'PACOTE DIAMANTE',
      subtitulo: 'TOTALMENTE PERSONALIZADO',
      preco: 0,
      descricao: 'Valor sob consulta',
      detalhes: [
        'Bar temático e exclusivo',
        'Todos os detalhes desenvolvidos conforme o estilo dos anfitriões',
        'Ideal para quem busca uma experiência única'
      ],
      icon: <Gem className="h-6 w-6" />,
      cor: 'plano-diamante',
      minConvidados: 0
    }
  ];

  const calcularOrcamento = () => {
    const pacoteId = formData.pacote || pacoteSelecionado;
    const pacote = pacotes.find(p => p.id === pacoteId);
    
    console.log('Calculando orçamento:', {
      pacoteId,
      pacote,
      convidados: formData.convidados
    });
    
    if (!pacote || pacote.preco === 0) {
      console.log('Pacote não encontrado ou preço 0');
      return 0;
    }
    
    const numConvidados = parseInt(formData.convidados) || 0;
    const valorPorPessoa = numConvidados < 50 && pacote.precoMenos50 
      ? pacote.precoMenos50 
      : pacote.preco;
    
    const valorTotal = valorPorPessoa * numConvidados;
    
    console.log('Cálculo detalhado:', {
      numConvidados,
      valorPorPessoa,
      valorTotal,
      'valorTotal arredondado': Math.round(valorTotal * 100) / 100
    });
    
    // Multiplicar por 100, arredondar e dividir por 100 para precisão com centavos
    return Math.round(valorTotal * 100) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('pacoteSelecionado:', pacoteSelecionado);
    console.log('formData.pacote:', formData.pacote);
    console.log('formData:', formData);

    const pacoteId = formData.pacote || pacoteSelecionado;
    const numConvidados = parseInt(formData.convidados) || 0;

    const missing: string[] = [];
    if (!formData.nome) missing.push('Nome Completo');
    if (!formData.email) missing.push('E-mail');
    if (!formData.telefone) missing.push('Telefone/WhatsApp');
    if (!formData.evento) missing.push('Tipo de Evento');
    if (!formData.convidados) missing.push('Número de Convidados');
    if (!formData.data) missing.push('Data do Evento');
    if (!pacoteId) missing.push('Pacote');
    
    // Para plano diamante ou eventos com exatamente 50 pessoas nos pacotes principais, não exige bancada pois serão tratados de forma personalizada
    if (pacoteId !== 'diamante' && !(numConvidados === 50 && ['bronze', 'prata', 'ouro'].includes(pacoteId)) && !formData.bancada) {
      missing.push('Bancada');
    }

    if (missing.length) {
      toast({
        title: 'Campos obrigatórios',
        description: `Por favor, preencha: ${missing.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }


    // Para plano diamante ou eventos com exatamente 50 pessoas nos pacotes principais, redireciona direto para WhatsApp
    if (pacoteId === 'diamante' || (numConvidados === 50 && ['bronze', 'prata', 'ouro'].includes(pacoteId))) {
      let messageTitle = '';
      let messageContent = '';
      
      if (pacoteId === 'diamante') {
        messageTitle = 'SOLICITACAO PACOTE DIAMANTE - TWINS DRINKS';
        messageContent = 'Gostaria de uma proposta totalmente personalizada para o Pacote Diamante.';
      } else {
        // Para eventos com exatamente 50 pessoas nos pacotes principais
        const pacoteNome = pacotes.find(p => p.id === pacoteId)?.nome || '';
        messageTitle = `SOLICITACAO ${pacoteNome} - TWINS DRINKS`;
        messageContent = `Gostaria de uma proposta personalizada para o ${pacoteNome} com ${numConvidados} convidados.`;
      }

      const message = `${messageTitle}

DADOS PESSOAIS:
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}

DETALHES DO EVENTO:
Tipo: ${formData.evento}
Data: ${new Date(formData.data).toLocaleDateString('pt-BR')}
Horario: ${formData.horario || 'A definir'}
Local: ${formData.local || 'A definir'}
Numero de convidados: ${formData.convidados} pessoas
${formData.bancada ? `Bancada escolhida: ${formData.bancada.replace('-', ' ').toUpperCase()}` : ''}

OBSERVACOES ESPECIAIS:
${formData.observacoes || `Gostaria de uma proposta ${pacoteId === 'diamante' ? 'totalmente personalizada para meu evento' : 'detalhada para este pacote'}`}

${messageContent}`;

      window.open(`https://wa.me/5511942727822?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    const valor = calcularOrcamento();
    setValorEstimado(valor);
    setShowOrcamento(true);
    
    toast({
      title: 'Orçamento calculado com sucesso!',
      description: 'Confira o valor estimado abaixo. Entraremos em contato para finalizar os detalhes.',
    });
  };

  const handleNovoOrcamento = () => {
    setShowOrcamento(false);
    setPacoteSelecionado('');
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      evento: '',
      data: '',
      horario: '',
      local: '',
      convidados: '',
      pacote: '',
      bancada: '',
      observacoes: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmarWhatsApp = () => {
    const pacoteEscolhido = pacotes.find(p => p.id === (formData.pacote || pacoteSelecionado));
    const message = `SOLICITACAO DE ORCAMENTO - TWINS DRINKS

DADOS PESSOAIS:
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}

DETALHES DO EVENTO:
Tipo: ${formData.evento}
Data: ${new Date(formData.data).toLocaleDateString('pt-BR')}
Horario: ${formData.horario || 'A definir'}
Local: ${formData.local || 'A definir'}
Numero de convidados: ${formData.convidados} pessoas

PACOTE SELECIONADO:
${pacoteEscolhido?.nome || 'Nao selecionado'}
${pacoteEscolhido?.descricao || ''}
Valor por pessoa: R$ ${pacoteEscolhido?.preco?.toFixed(2) || 'Sob consulta'}

BANCADA ESCOLHIDA:
${formData.bancada ? formData.bancada.replace('-', ' ').toUpperCase() : 'Nao selecionada'}

VALOR ESTIMADO TOTAL:
R$ ${valorEstimado.toLocaleString('pt-BR')}

OBSERVACOES:
${formData.observacoes || 'Nenhuma observacao adicional'}

Gostaria de confirmar este orcamento e receber mais informacoes sobre disponibilidade e condicoes de pagamento.`;
    
    window.open(`https://wa.me/5511942727822?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <ThemeProvider selectedPacote={pacoteSelecionado || formData.pacote}>
      <div className="min-h-screen bg-background transition-all duration-1000 ease-in-out">
        <Header />
        
        {showOrcamento ? (
          <OrcamentoResult 
            formData={formData}
            pacoteSelecionado={pacoteSelecionado}
            pacotes={pacotes}
            valorEstimado={valorEstimado}
            onNovoOrcamento={handleNovoOrcamento}
            onConfirmarWhatsApp={handleConfirmarWhatsApp}
          />
        ) : (
          <>
            <OrcamentoPacotes 
              pacotes={pacotes}
              pacoteSelecionado={pacoteSelecionado}
              onSelectPacote={(id) => {
                console.log('Pacote selecionado:', id);
                setPacoteSelecionado(id);
                handleChange('pacote', id);
              }}
            />
            
            <OrcamentoPriceTable />
            
            <OrcamentoForm 
              formData={formData}
              pacoteSelecionado={pacoteSelecionado}
              pacotes={pacotes}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </>
        )}

        <Footer />
      </div>
    </ThemeProvider>
  );
}