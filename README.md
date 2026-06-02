# Portal Parceiro MVP — Pipeline de Integrações e Score ProdTech

## Sumário

Visão Geral

Arquitetura do Pipeline

Fontes de Dados

Tabela Gerada

Regras de Classificação de Integração

Problema Resolvido: Duplicação por Alfândega

Query do Score ProdTech

Glossário de Colunas

---

## Visão Geral

O Portal Parceiro MVP é um pipeline analítico que consolida dados de cotações, emissões, erros e integrações para gerar um score de maturidade tecnológica (ProdTech) por seguradora.

A pontuação avalia quatro dimensões:

Features (integrações disponíveis) — quantas das 8 integrações possíveis a seguradora já tem ativas

% Emissão Automática — quão automatizado é o processo de emissão

% Sucesso Cotação — taxa de cotações que viraram apólice

Quantidade de Clientes — base de clientes que utilizam o canal

O pipeline roda em Databricks (PySpark), lê dados do MySQL (3 bancos: ReportDB, db_relatorio, pre-alfandega-prod) e grava a tabela final de volta no MySQL para consumo pelo Metabase.

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
│                   │    │                   │    │   lote            │
└────────┬──────────┘    └────────┬──────────┘    └────────┬──────────┘
         │                        │                        │
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
                    │  Banco db_relatorio                            │
                    │  tb_portal_parceiro_mvo_consolidado            │
                    └────────────┬────────────────────────────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │ Query do Score (Metabase)│
                    │ Calcula o ProdTech       │
                    └──────────────────────────┘
```

---

## Fontes de Dados

### ReportDB

Tabela | Uso

operational_policy | Emissões / apólices

operational_quote | Cotações

core_enumerate | Tipos de solicitação e recurso

core_client | Clientes

core_insurance_company | Seguradoras

core_status_apolice | Status de apólice

core_user | Usuários

### db_relatorio

Tabela | Uso

tb_emissoes | Emissões financeiras

tb_performance_cotacao | Cotações com performance

tb_erros_cotacao | Erros de cotação

### pre-alfandega-prod

Tabela | Uso

tb_pre_alfandega_processado | Apólices importadas via Alfândega

tb_pre_alfandega_lote | Lotes de Alfândega

---

## Tabela Gerada

O pipeline grava uma tabela final no MySQL (db_relatorio).

### tb_portal_parceiro_mvo_consolidado — Base Analítica Final

Uma linha por cotação.

Contém:

- Dados de cotação
- Dados de emissão
- Dados de erro
- Classificação de integração (1 a 8, incluindo Alfândega)
- Flags operacionais

Principais grupos de colunas:

Cotação: id_cotacao, dt_criacao_cotacao, seguradora_cotacao, cotacao_manual

Emissão: id_apolice, data_emissao, vl_premio, fl_emissao_automatica

Métricas base: vl_premio, data_emissao

---

## Regras de Classificação de Integração

Existem 8 integrações possíveis.

As classificações são geradas no pipeline a partir dos dados operacionais e da Alfândega e já estão disponíveis na coluna:

integracao

### Regras 1-7 (operational_*)

1 Recursal — tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição} e Modality = 3

2 Fiscal — tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição} e Modality = 2

3 Cível — tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição} e Modality = 1

4 Trabalhista — tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição} e Modality = 4

5 Outras Modalidades — tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição} e Modality fora de {1,2,3,4}

6 Cancelamento — id_enum_type_solicitation = 43 e enum_endorsement_type = 1

7 Endosso — id_enum_type_solicitation = 43 e enum_endorsement_type ∈ {2,3,4}

### Regra 8 — Alfândega

Identificação baseada no cruzamento entre número da apólice e nome da seguradora com a base de pré-alfândega.

---

## Regra de Integração Ativa

Uma integração é considerada ativa quando possui:

>= 5 cotações via API

Critério:

cotacao_manual = 0

---

## Problema Resolvido: Duplicação por Alfândega

A duplicação ocorria devido ao union entre integrações operacionais e Alfândega.

Solução aplicada:

- Integração unificada na coluna integracao
- Processamento resolvido no pipeline
- Eliminação de joins fan-out

Resultado: cada cotação aparece uma única vez na base consolidada.

---

## Query do Score ProdTech

A query roda no Metabase utilizando apenas a tabela consolidada.

### Métricas

Clientes: COUNT DISTINCT id_cliente

% Emissão automática:

apólices automáticas / apólices emitidas

% Sucesso cotação:

apólices emitidas / cotações

### Integrações

- Agrupamento por seguradora e integração
- Considera apenas API
- Integrações com >= 5 registros

---

### Score ProdTech

(score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes) / 4

---

## Glossário de Colunas

Coluna | Significado

id_cotacao | ID único da cotação

id_apolice | ID da apólice

dt_criacao_cotacao | Data criação

seguradora_cotacao | Seguradora

integracao | Tipo de integração

vl_premio | Prêmio

data_emissao | Data emissão

fl_emissao_automatica | Flag de automação

cotacao_manual | Manual vs API

---

## Notas de Operação

Periodicidade: execução diária

Modo: overwrite da tabela

Parâmetro DATA_INICIO aplicado no pipeline

Capitalização de seguradora padronizada com UPPER + TRIM

