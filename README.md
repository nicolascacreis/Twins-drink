# Portal Parceiro MVP — Pipeline de Integrações e Score ProdTech (Versão Atualizada)

## Sumário

- Visão Geral
- Arquitetura do Pipeline
- Fontes de Dados
- Tabela Gerada
- Regras de Classificação de Integração
- Query do Score ProdTech
- Glossário de Colunas
- Notas de Operação

---

## Visão Geral

O **Portal Parceiro MVP** é um pipeline analítico que consolida dados de cotações e emissões para gerar um **score de maturidade tecnológica (ProdTech)** por seguradora.

A pontuação avalia quatro dimensões:

- **Features (integrações disponíveis)**
- **% Emissão Automática**
- **% Sucesso Cotação**
- **Quantidade de Clientes**

---

## Arquitetura do Pipeline

```
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   ReportDB        │    │   db_relatorio    │    │ pre-alfandega-    │
│   (MySQL)         │    │   (MySQL)         │    │ prod (MySQL)      │
│                   │    │                   │    │                   │
│ operational_*     │    │ tb_emissoes       │    │ tb_pre_alfandega_ │
│ core_*            │    │ tb_performance_*  │    │   processado      │
│                   │    │ tb_erros_cotacao  │    │ tb_pre_alfandega_ │
└────────┬──────────┘    └────────┬──────────┘    │   lote            │
         │                        │                └────────┬──────────┘
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Notebook Databricks     │
                    │  portal_parceiro_mvp_*   │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────────────────────────┐
                    │ db_relatorio                                   │
                    │ tb_portal_parceiro_mvo_consolidado             │
                    └────────────┬────────────────────────────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │ Metabase                 │
                    │ Query Score ProdTech     │
                    └──────────────────────────┘
```

---

## Fontes de Dados

### ReportDB

| Tabela | Uso |
|------|-----|
| operational_policy | Emissões |
| operational_quote | Cotações |
| core_enumerate | Tipos e recursos |
| core_client | Clientes |
| core_insurance_company | Seguradoras |
| core_status_apolice | Status |
| core_user | Usuários |

---

### db_relatorio

| Tabela | Uso |
|------|-----|
| tb_emissoes | Financeiro |
| tb_performance_cotacao | Performance |
| tb_erros_cotacao | Erros |

---

### pre-alfandega-prod

| Tabela | Uso |
|------|-----|
| tb_pre_alfandega_processado | Apólices |
| tb_pre_alfandega_lote | Seguradora |

---

## Tabela Gerada

### tb_portal_parceiro_mvo_consolidado

Grão: **1 linha por cotação**

Contém:

- Dados de cotação
- Dados de emissão
- Coluna de integração já classificada
- Flags de API/manual

👉 Esta tabela substitui toda a modelagem anterior (mvp + integrações + alfândega separadas)

---

## Regras de Classificação de Integração

Agora as integrações já vêm pré-classificadas na coluna:

```
integracao
```

As 8 integrações continuam sendo:

1. Recursal  
2. Fiscal  
3. Cível  
4. Trabalhista  
5. Outras Modalidades  
6. Cancelamento  
7. Endosso  
8. Alfândega

### Origem das regras

- Integrações 1–7 derivadas do modelo operacional (operational_*)
- Integração 8 derivada da Alfândega

---

## Regra de Integração Ativa

Uma integração é considerada ativa quando:

```
>= 5 cotações via API
```

Critério técnico:

```
cotacao_manual = 0
```

---

## Query do Score ProdTech (Lógica)

### Métricas

- Clientes: COUNT(DISTINCT id_cliente)
- Emissão automática:
  - apólices com fl_emissao_automatica = 1
- Sucesso cotação:
  - apólices emitidas / cotações

---

### Integrações

- Agrupamento por seguradora + integracao
- Filtra integrações com volume >= 5
- Soma total

---

### Scores

Mesmas regras da query atual:

- Features (integrações)
- Emissão automática
- Sucesso cotação
- Clientes

---

### Score final

```
(score_features + score_emissao + score_sucesso + score_clientes) / 4
```

---

## Glossário de Colunas

| Coluna | Descrição |
|--------|---------|
| id_cotacao | ID da cotação |
| id_apolice | ID da apólice |
| integracao | Classificação da integração |
| cotacao_manual | Manual vs API |
| fl_emissao_automatica | Flag de automação |
| vl_premio | Valor do prêmio |
| data_emissao | Data |

---

## Notas de Operação

- Execução diária (recomendado)
- Overwrite da tabela
- Integrações já resolvidas no pipeline
- Sem risco de duplicação

---

