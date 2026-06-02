# Portal Parceiro MVP — Pipeline de Score ProdTech (Versão Consolidada)

## Sumário

- Visão Geral
- Arquitetura do Pipeline (Atual)
- Fonte de Dados
- Tabela Final
- Lógica de Construção do Score
- Cálculo de Integrações
- Regras de Score
- Query do Score ProdTech
- Glossário de Colunas
- Diferenças da Versão Anterior
- Notas de Operação

---

## Visão Geral

O **Portal Parceiro MVP** é um pipeline analítico que consolida dados operacionais de cotações e emissões para calcular um **score de maturidade tecnológica (ProdTech)** por seguradora.

A pontuação avalia quatro dimensões:

- **Features (integrações disponíveis)** — quantas integrações estão ativas
- **% Emissão Automática** — nível de automação do processo
- **% Sucesso Cotação** — conversão de cotação em apólice
- **Quantidade de Clientes** — base ativa no canal

Nesta versão, o modelo foi **simplificado**:

👉 Todo o cálculo agora usa **uma única tabela consolidada**
👉 Eliminadas dependências de tabelas auxiliares e Alfândega
👉 Zero risco de duplicação por fan-out

---

## Arquitetura do Pipeline (Atual)

```
┌──────────────────────────────┐
│   Databricks (PySpark)       │
│   portal_parceiro_mvp_*      │
└──────────────┬───────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ MySQL (db_relatorio)              │
│ tb_portal_parceiro_mvo_consolidado│
└──────────────┬─────────────────────┘
               ▼
┌──────────────────────────┐
│ Metabase                 │
│ Query Score ProdTech     │
└──────────────────────────┘
```

---

## Fonte de Dados

Tabela única utilizada:

### tb_portal_parceiro_mvo_consolidado

Grão: **1 linha por cotação**

Contém:

- Dados de cotação
- Dados de emissão
- Flags de automação
- Classificação de integração

---

## Tabela Final

A tabela consolidada substitui completamente:

❌ tb_portal_parceiro_mvp  
❌ tb_portal_parceiro_integracoes  
❌ Base de Afândega

---

## Lógica de Construção do Score

O cálculo segue 4 blocos:

### 1. Normalização

```
UPPER(TRIM(seguradora_cotacao))
```

---

### 2. Métricas Principais

#### Clientes

```
COUNT(DISTINCT id_cliente)
```

---

#### % Emissão Automática

```
apolices_automaticas / apolices_emitidas
```

Regras:

- Considera emissão válida:
  - vl_premio > 0
  - data_emissao <> NULL

- Considera automática:
  - fl_emissao_automatica = 1

---

#### % Sucesso Cotação

```
apolices_emitidas / cotacoes
```

---

## Cálculo de Integrações

### Definição de integração ativa

Uma integração é considerada ativa quando:

```
>= 5 cotações via API
```

### Regras técnicas

1. Considera apenas:

```
cotacao_manual = 0
```

2. Agrupa por:

- seguradora
- integracao

3. Conta por integração

4. Filtra integrações com volume >= 5

5. Conta o total final:

```
quantidade_integracoes
```

---

## Regras de Score

### Score Features

| Integrações | Score |
|------------|------|
| 3 | 1 |
| 4 | 2 |
| 5 ou 6 | 3 |
| 7 | 4 |
| >= 8 | 5 |
| outros | 0 |

---

### Score Emissão Automática

| Faixa | Score |
|------|------|
| < 20% | 1 |
| 20%–40% | 2 |
| 40%–60% | 3 |
| 60%–80% | 4 |
| > 80% | 5 |
| outros | 0 |

---

### Score Sucesso Cotação

| Faixa | Score |
|------|------|
| < 30% | 1 |
| 30%–40% | 2 |
| 40%–50% | 3 |
| 50%–60% | 4 |
| > 60% | 5 |
| outros | 0 |

---

### Score Clientes

| Faixa | Score |
|------|------|
| < 10 | 1 |
| 10–39 | 2 |
| 40–69 | 3 |
| 70–99 | 4 |
| > 100 | 5 |
| outros | 0 |

---

## Score ProdTech Final

```
(score_features + score_emissao + score_sucesso + score_clientes) / 4
```

- Arredondado em 2 casas
- Limitado entre 0 e 5

---

## Query do Score ProdTech

(versão simplificada com base única)

```sql
SELECT
    seguradora,
    quantidade_integracoes,
    percentual_emissao_automatica,
    percentual_sucesso_cotacao,
    quantidade_clientes,
    score_features,
    score_emissao_automatica,
    score_sucesso_cotacao,
    score_clientes,
    ROUND((score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes)/4,2) AS score_prodtech
FROM calculo_scores
```

---

## Glossário de Colunas

### Principais

| Coluna | Descrição |
|--------|---------|
| id_cotacao | Identificador da cotação |
| id_apolice | Identificador da apólice |
| seguradora_cotacao | Seguradora da cotação |
| integracao | Tipo de integração |
| cotacao_manual | 1 = manual / 0 = API |
| fl_emissao_automatica | Flag de emissão via API |
| vl_premio | Valor do prêmio |
| data_emissao | Data da emissão |

---

## Diferenças da Versão Anterior

### Removido

- Pipeline de integrações separado
- Dependência de Alfândega
- Join entre tabelas
- Problemas de duplicação

### Novo modelo

- Fonte única
- Integrações derivadas direto da base
- Mais performático
- Mais simples

---

## Notas de Operação

- Execução recomendada: diária
- Tabela sobrescrita a cada execução
- Qualidade da coluna `integracao` é crítica
- `cotacao_manual` define API vs Manual

---

## Conclusão

O modelo atual representa uma evolução arquitetural:

✅ Redução de complexidade  
✅ Eliminação de duplicação  
✅ Maior confiabilidade  
✅ Melhor performance

