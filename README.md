# Portal Parceiro MVP — Pipeline de Integrações e Score ProdTech

## Sumário

- Visão Geral
- Arquitetura do Pipeline
- Fontes de Dados
- Tabela Gerada
- Tabela de Referência: Integrações
- Regras de Classificação de Integração
- Problema Resolvido: Duplicação por Alfândega
- Query do Score ProdTech
- Glossário de Colunas
- Notas de Operação

---

## Visão Geral

O Portal Parceiro MVP é um pipeline analítico que consolida dados de cotações, emissões, erros e integrações para gerar um score de maturidade tecnológica (ProdTech) por seguradora.

A pontuação avalia quatro dimensões:

- Features (integrações disponíveis)
- % Emissão Automática
- % Sucesso Cotação
- Quantidade de Clientes

---

## Arquitetura do Pipeline

```
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│   ReportDB        │    │   db_relatorio    │    │ pre-alfandega-    │
│   (MySQL)         │    │   (MySQL)         │    │ prod (MySQL)      │
│ operational_*     │    │ tb_emissoes       │    │ tb_pre_alfandega_ │
│ core_*            │    │ tb_performance_*  │    │ processado        │
│                   │    │ tb_erros_cotacao  │    │ lote              │
└────────┬──────────┘    └────────┬──────────┘    └────────┬──────────┘
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │ Notebook Databricks      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────────────┐
                    │ tb_portal_parceiro_mvo_consolidado │
                    └────────────┬────────────────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │ Metabase                 │
                    └──────────────────────────┘
```

---

## Fontes de Dados

### ReportDB

| Tabela | Uso |
|-------|-----|
| operational_policy | Emissões |
| operational_quote | Cotações |
| core_enumerate | Tipos |
| core_client | Clientes |
| core_insurance_company | Seguradoras |
| core_status_apolice | Status |
| core_user | Usuários |

### db_relatorio

| Tabela | Uso |
|-------|-----|
| tb_emissoes | Financeiro |
| tb_performance_cotacao | Performance |
| tb_erros_cotacao | Erros |

### pre-alfandega-prod

| Tabela | Uso |
|-------|-----|
| tb_pre_alfandega_processado | Apólices |
| tb_pre_alfandega_lote | Lotes |

---

## Tabela Gerada

### tb_portal_parceiro_mvo_consolidado

| Grupo | Colunas |
|------|--------|
| Cotação | id_cotacao, dt_criacao_cotacao, seguradora_cotacao, cotacao_manual |
| Emissão | id_apolice, data_emissao, vl_premio, fl_emissao_automatica |
| Integração | integracao |

---

## Tabela de Referência: Integrações

### tb_portal_parceiro_integracoes

| Coluna | Significado |
|--------|------------|
| seguradora | Nome da seguradora |
| integracao | Nome da integração |
| qtd_api | Cotações via API |
| qtd_manual | Cotações manuais |
| cont_integracao | 1 se qtd_api >= 5 |
| qtd_alfandega | Volume da Alfândega |

---

## Regras de Classificação de Integração

### Regras 1-7

| # | Integração | Condição |
|--|-----------|---------|
| 1 | Recursal | Modality = 3 |
| 2 | Fiscal | Modality = 2 |
| 3 | Cível | Modality = 1 |
| 4 | Trabalhista | Modality = 4 |
| 5 | Outras | Fora 1-4 |
| 6 | Cancelamento | tipo = 43 e endosso = 1 |
| 7 | Endosso | tipo = 43 e endosso in (2,3,4) |

### Regra 8

Alfândega baseada em cruzamento de apólice.

---

## Problema Resolvido: Duplicação por Alfândega

A duplicação ocorria por união entre integrações.

Solução:

- Classificação resolvida no pipeline
- Linha única por cotação

---

## Query do Score ProdTech

### Métricas

| Métrica | Cálculo |
|--------|--------|
| Clientes | DISTINCT id_cliente |
| Emissão automática | apólice automática / emitida |
| Sucesso | apólice / cotação |

### Score Final

(score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes) / 4

---

## Glossário de Colunas

| Coluna | Significado |
|--------|------------|
| id_cotacao | ID cotação |
| id_apolice | ID apólice |
| integracao | Tipo |
| vl_premio | Valor |
| data_emissao | Data |
| fl_emissao_automatica | Flag |
| cotacao_manual | API vs manual |

---

## Notas de Operação

- Execução diária
- Overwrite
- Normalização com UPPER TRIM

