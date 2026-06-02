# Portal Parceiro MVP — Pipeline de Integrações e Score ProdTech

## Sumário

- Visão Geral
- Arquitetura do Pipeline
- Fontes de Dados
- Tabelas Geradas
- Regras de Classificação de Integração
- Problema Resolvido: Duplicação por Alfândega
- Query do Score ProdTech
- Query Atual do Score ProdTech (Base Consolidada)
- Glossário de Colunas
- Notas de Operação

---

## Visão Geral

O Portal Parceiro MVP é um pipeline analítico que consolida dados de cotações, emissões, erros e integrações para gerar um score de maturidade tecnológica (ProdTech) por seguradora.

A pontuação avalia quatro dimensões:

- **Features (integrações disponíveis)** — quantas das 8 integrações possíveis a seguradora já tem ativas
- **% Emissão Automática** — quão automatizado é o processo de emissão
- **% Sucesso Cotação** — taxa de cotações que viraram apólice
- **Quantidade de Clientes** — base de clientes que utilizam o canal

O pipeline roda em Databricks (PySpark), lê dados do MySQL (3 bancos: ReportDB, db_relatorio, pre-alfandega-prod) e grava as tabelas finais de volta no MySQL para consumo pelo Metabase.

---

## Arquitetura do Pipeline

```text
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
                    ┌────────────────────────────────────────────────────┐
                    │ Banco db_relatorio                                 │
                    │ tb_portal_parceiro_mvp                             │
                    │ tb_portal_parceiro_integracoes                     │
                    │ tb_portal_parceiro_mvo_consolidado                 │
                    └────────────┬───────────────────────────────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │ Query do Score (Metabase)│
                    │ Calcula o ProdTech       │
                    └──────────────────────────┘
```

---

## Fontes de Dados

### ReportDB

| Tabela | Uso |
|---|---|
| operational_policy | Emissões / apólices |
| operational_quote | Cotações |
| core_enumerate | Tipos de solicitação e recurso |
| core_client | Clientes |
| core_insurance_company | Seguradoras |
| core_status_apolice | Status de apólice |
| core_user | Usuários |

### db_relatorio (Financeiro)

| Tabela | Uso |
|---|---|
| tb_emissoes | Emissões financeiras |
| tb_performance_cotacao | Cotações com performance |
| tb_erros_cotacao | Erros de cotação |

### pre-alfandega-prod

| Tabela | Uso |
|---|---|
| tb_pre_alfandega_processado | Apólices importadas via Alfândega |
| tb_pre_alfandega_lote | Lotes de Alfândega (com nome da seguradora) |

---

## Tabelas Geradas

O pipeline grava as tabelas analíticas no MySQL (db_relatorio).

### tb_portal_parceiro_mvp — Base Analítica

Uma linha por cotação. Contém todas as métricas de cotação, emissão, erro, status, usuário, valores e flags. Não contém colunas de integração — essas vivem na tabela separada para evitar duplicação por fan-out.

**Principais grupos de colunas:**

- **Cotação:** `id_cotacao`, `numero_cotacao`, `dt_criacao_cotacao`, `vl_premio_cotacao`, `seguradora_cotacao`, `status_cotacao`, `cotacao_manual`
- **Emissão:** `id_apolice`, `numero_apolice`, `data_emissao`, `seguradora_emissao`, `vl_premio`, `fl_apolice_emitida`, `fl_emissao_automatica`
- **Erro:** `numero_apolice_erro`, `seguradora_erro`, `tipo_erro`
- **Métricas calculadas:** `quantidade_cotacoes`, `quantidade_cotacoes_sucesso`, `%_sucesso_por_cotacao`, `cotacao_vencedora`, `saude_mktplace`, `quantidade_emissoes`, `quantidade_emissoes_automaticas`, `%_emissao_automatica`
- **Classificações:** `manual_vs_api`, `api_manual`, `portal_vs_data_emissao`

### tb_portal_parceiro_integracoes — Integrações por Seguradora

Estrutura igual ao `df_base_1_7` original, com uma coluna adicional para a Alfândega:

| Coluna | Tipo | Descrição |
|---|---|---|
| seguradora | string | Nome da seguradora |
| integracao | string | Nome da integração (1- Recursal, 2- Fiscal, 3- Cível, 4- Trabalhista, 5- Outras Modalidades, 6- Cancelamento, 7- Endosso) |
| qtd_api | int | Quantidade de cotações via API para essa seguradora × integração |
| qtd_manual | int | Quantidade de cotações manuais |
| cont_integracao | int | 1 se `qtd_api >= 5`, senão 0. Esta é a regra de integração ativa |
| qtd_alfandega | int | Quantidade total de cotações via Alfândega da seguradora (repetido em todas as linhas dela) |

**Exemplo:**

| seguradora | integracao | qtd_api | qtd_manual | cont_integracao | qtd_alfandega |
|---|---|---:|---:|---:|---:|
| AVLA SEGUROS BRASIL S.A. | 3- Cível | 1753 | 68 | 1 | 12 |
| AVLA SEGUROS BRASIL S.A. | 7- Endosso | 850 | 30 | 1 | 12 |
| TOKIO MARINE SEGURADORA S.A. | 2- Fiscal | 0 | 28 | 0 | 5 |

**Nota:** `qtd_alfandega` é métrica por seguradora, não por integração. Por isso o valor se repete em todas as linhas da mesma seguradora. No score, isso é tratado com `MAX(qtd_alfandega)` no `GROUP BY`.

### tb_portal_parceiro_mvo_consolidado — Base Consolidada

Tabela consolidada utilizada para consultas analíticas e para a query atual do score em base única.

**Principais colunas consumidas no score:**

| Coluna | Descrição |
|---|---|
| seguradora_cotacao | Nome da seguradora da cotação |
| id_cliente | Identificador do cliente |
| id_apolice | Identificador da apólice emitida |
| id_cotacao | Identificador da cotação |
| integracao | Classificação da integração da linha |
| vl_premio | Valor do prêmio da emissão |
| data_emissao | Data da emissão |
| fl_emissao_automatica | Flag de emissão automática |
| cotacao_manual | Identifica se a cotação foi manual |

**Finalidade analítica:**

- Consolidar em uma única base os dados operacionais relevantes ao score
- Permitir leitura direta no Metabase sem necessidade de join entre tabelas analíticas
- Preservar a classificação de integração dentro da própria base

---

## Regras de Classificação de Integração

Existem 8 integrações possíveis. As regras 1-7 vêm do cruzamento entre cotação (`operational_quote`), emissão (`operational_policy`) e tipo de solicitação (`core_enumerate`). A regra 8 vem do cruzamento da apólice com a base da Alfândega.

### Regras 1-7 (a partir de `operational_*`)

| # | Integração | Condição |
|---:|---|---|
| 1 | Recursal | `tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição}` e `Modality = 3` |
| 2 | Fiscal | `tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição}` e `Modality = 2` |
| 3 | Cível | `tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição}` e `Modality = 1` |
| 4 | Trabalhista | `tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição}` e `Modality = 4` |
| 5 | Outras Modalidades | `tipo_solicitacao ∈ {Apólice Nova, Renovação, Substituição}` e `Modality fora de {1,2,3,4}` |
| 6 | Cancelamento | `id_enum_type_solicitation = 43` e `enum_endorsement_type = 1` |
| 7 | Endosso | `id_enum_type_solicitation = 43` e `enum_endorsement_type ∈ {2, 3, 4}` |
| 8 | Alfandega | `Cruzamento por número da apólice e nome da seguradora` |

**Regra de ativa:** uma integração é considerada ativa para a seguradora quando `qtd_api >= 5` (a coluna `cont_integracao` da tabela vira `1`).

### Regra 8 — Alfândega

Cruzamento por número da apólice e nome da seguradora:

```python
integ_alfandega = integracoes.join(
    df_alfandega1,
    (col("op_txt_policy_number") == col("alf_txt_numero_apolice")) &
    (col("cic_txt_name").contains(col("alf_lote_txt_nome_seguradora"))),
    "inner"
)
```

Importante: o nome da seguradora vindo da Alfândega é colocado em `UPPER+TRIM` antes do match para garantir consistência.

---

## Problema Resolvido: Duplicação por Alfândega

### O que estava acontecendo

A versão anterior do pipeline fazia `unionByName(selecao_1_7_9, selecao_8)` para juntar todas as integrações em uma única tabela `selecao_total`. Isso causava duas duplicações:

1. **No nível de cotação:** uma cotação que casava em uma das regras 1-7 e também na regra 8 (Alfândega) virava duas linhas em `selecao_total`. Quando essa tabela era agregada por cotação para construir o array `integracoes`, gerava casos onde a mesma cotação aparecia duas vezes no `resultado_final`.
2. **No nível de seguradora (`final_v2`):** havia um join entre `resultado_final` e `df_base_1_7` por `chave_join` (nome da seguradora normalizado). Como `df_base_1_7` tem múltiplas linhas por seguradora (uma por integração), esse join era 1-para-N e multiplicava cada linha de `resultado_final`. As contagens explodiam.

### Solução

Separação completa entre 1-7 e 8 desde a construção:

- A regra 8 não entra mais no `unionByName`. Ela é processada em paralelo, em sua própria pipeline (`integ_alfandega → qtd_alfandega_por_seguradora`).
- O `resultado_final` (`tb_portal_parceiro_mvp`) não tem mais coluna `integracao` nem `integracoes`. Toda informação de integração mora na tabela separada `tb_portal_parceiro_integracoes`.
- A construção do `final_v2` (com `chave_join`) foi removida. O fan-out morreu junto.
- A coluna `qtd_alfandega` foi adicionada à tabela de integrações via `LEFT JOIN` na chave de seguradora padronizada (`UPPER+TRIM` nos dois lados), com `COALESCE(qtd_alfandega, 0)` para seguradoras que nunca tiveram Alfândega.

Resultado: zero duplicação, e a Alfândega fica visível como uma coluna extra sem afetar as métricas das integrações 1-7.

---

## Query do Score ProdTech

A query roda no Metabase lendo as duas tabelas do MySQL (`tb_portal_parceiro_mvp` e `tb_portal_parceiro_integracoes`) e calcula o score final por seguradora.

### Lógica em camadas

- `integracoes_por_seguradora` — agrega `tb_portal_parceiro_integracoes` em 1 linha por seguradora, somando `cont_integracao` (das 1-7) e pegando `MAX(qtd_alfandega)`.
- `metricas` — junta com `tb_portal_parceiro_mvp` por nome de seguradora (`UPPER+TRIM`) e calcula `qtd_integracoes`, `qtd_clientes`, `pct_emissao_automatica`, `pct_sucesso_cotacao`.
- `scores` — converte cada métrica em score discreto de 1-5 (com piso de `0.10` para casos fora da faixa).
- `SELECT final` — formata percentuais, ordena por score médio.

### Cálculo do `qtd_integracoes`

```text
qtd_integracoes = COALESCE(qtd_integracoes_1_7, 0)
                + CASE WHEN COALESCE(qtd_alfandega, 0) >= 1 THEN 1 ELSE 0 END
```

Range: 0 a 8. A Alfândega entra como `+1` fixo se a seguradora tem 1 ou mais cotações via Alfândega — independente do volume.

### Tabelas de Score (faixas)

#### Score Features (`qtd_integracoes`)

| qtd_integracoes | score |
|---:|---:|
| 3 | 1 |
| 4 | 2 |
| 5 | 3 |
| 6 | 3 |
| 7 | 4 |
| 8 | 5 |
| outros (0, 1, 2) | 0.10 |

#### Score Emissão Automática (`pct_emissao_automatica`)

| Faixa | score |
|---|---:|
| `< 10%` | 1 |
| `10% – 45%` | 2 |
| `45% – 65%` | 3 |
| `65% – 78%` | 4 |
| `> 78,1%` | 5 |
| `null/fora` | 0.10 |

#### Score Sucesso Cotação (`pct_sucesso_cotacao`)

| Faixa | score |
|---|---:|
| `< 30%` | 1 |
| `30% – 40%` | 2 |
| `40% – 50%` | 3 |
| `50% – 60%` | 4 |
| `> 60%` | 5 |
| `null/fora` | 0.10 |

#### Score Clientes (`qtd_clientes`)

| Faixa | score |
|---|---:|
| `< 10` | 1 |
| `10 – 39` | 2 |
| `40 – 69` | 3 |
| `70 – 99` | 4 |
| `>= 100` | 5 |
| `null/fora` | 0.10 |

### Score ProdTech Médio

Média aritmética simples dos quatro scores acima, arredondada a 2 casas:

```sql
ROUND(
    (score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes) / 4.0
, 2)
```

Como cada score individual nunca é `null` nem zero (mínimo `0.10`), o denominador é sempre 4. Range teórico do score médio: `0.10` a `5.00`.

### Query Completa

```sql
WITH integracoes_por_seguradora AS (
    SELECT
        UPPER(TRIM(seguradora))     AS chave_seg,
        SUM(cont_integracao)        AS qtd_integracoes_1_7,
        MAX(qtd_alfandega)          AS qtd_alfandega
    FROM tb_portal_parceiro_integracoes
    WHERE seguradora IS NOT NULL
      AND seguradora <> ''
    GROUP BY UPPER(TRIM(seguradora))
),
metricas AS (
    SELECT
        p.seguradora_cotacao AS seguradora,
        COALESCE(i.qtd_integracoes_1_7, 0)
            + CASE WHEN COALESCE(i.qtd_alfandega, 0) >= 1 THEN 1 ELSE 0 END
            AS qtd_integracoes,
        COUNT(DISTINCT CASE WHEN p.id_cliente IS NOT NULL THEN p.id_cliente END) AS qtd_clientes,
        COUNT(DISTINCT CASE WHEN p.vl_premio > 0 AND p.data_emissao IS NOT NULL AND p.fl_emissao_automatica = 1 THEN p.id_apolice END) * 1.0
        / NULLIF(COUNT(DISTINCT CASE WHEN p.vl_premio > 0 AND p.data_emissao IS NOT NULL THEN p.id_apolice END), 0) AS pct_emissao_automatica,
        COUNT(DISTINCT CASE WHEN p.vl_premio > 0 AND p.data_emissao IS NOT NULL THEN p.id_apolice END) * 1.0
        / NULLIF(COUNT(DISTINCT p.id_cotacao), 0) AS pct_sucesso_cotacao
    FROM tb_portal_parceiro_mvp p
    LEFT JOIN integracoes_por_seguradora i
           ON UPPER(TRIM(p.seguradora_cotacao)) = i.chave_seg
    WHERE p.seguradora_cotacao IS NOT NULL
      AND p.seguradora_cotacao <> ''
      [[AND p.dt_criacao_cotacao >= {{data_inicio}}]]
      [[AND {{seguradora}}]]
    GROUP BY p.seguradora_cotacao, i.qtd_integracoes_1_7, i.qtd_alfandega
),
scores AS (
    SELECT
        seguradora, qtd_integracoes, qtd_clientes,
        pct_emissao_automatica, pct_sucesso_cotacao,
        CASE
            WHEN qtd_integracoes = 3 THEN 1
            WHEN qtd_integracoes = 4 THEN 2
            WHEN qtd_integracoes = 5 THEN 3
            WHEN qtd_integracoes = 6 THEN 3
            WHEN qtd_integracoes = 7 THEN 4
            WHEN qtd_integracoes >= 8 THEN 5
            ELSE 0.10
        END AS score_features,
        CASE
            WHEN pct_emissao_automatica < 0.10 THEN 1
            WHEN pct_emissao_automatica <= 0.45 THEN 2
            WHEN pct_emissao_automatica <= 0.65 THEN 3
            WHEN pct_emissao_automatica <= 0.78 THEN 4
            WHEN pct_emissao_automatica > 0.781 THEN 5
            ELSE 0.10
        END AS score_emissao_automatica,
        CASE
            WHEN pct_sucesso_cotacao < 0.30 THEN 1
            WHEN pct_sucesso_cotacao <= 0.40 THEN 2
            WHEN pct_sucesso_cotacao <= 0.50 THEN 3
            WHEN pct_sucesso_cotacao <= 0.60 THEN 4
            WHEN pct_sucesso_cotacao > 0.60 THEN 5
            ELSE 0.10
        END AS score_sucesso_cotacao,
        CASE
            WHEN qtd_clientes < 10 THEN 1
            WHEN qtd_clientes <= 39 THEN 2
            WHEN qtd_clientes <= 69 THEN 3
            WHEN qtd_clientes <= 99 THEN 4
            WHEN qtd_clientes >= 100 THEN 5
            ELSE 0.10
        END AS score_clientes
    FROM metricas
)
SELECT
    seguradora                                              AS `Seguradora`,
    qtd_integracoes                                         AS `Qtd Integrações`,
    CONCAT(ROUND(pct_emissao_automatica * 100, 2), '%')     AS `% Emissão Automática`,
    CONCAT(ROUND(pct_sucesso_cotacao * 100, 2), '%')        AS `% Sucesso Cotação`,
    qtd_clientes                                            AS `Qtd Clientes`,
    score_features                                          AS `Score Features`,
    score_emissao_automatica                                AS `Score Emissão Auto`,
    score_sucesso_cotacao                                   AS `Score Sucesso Cot.`,
    score_clientes                                          AS `Score Clientes`,
    ROUND(
        (score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes) / 4.0
    , 2) AS `Score ProdTech Médio`
FROM scores
ORDER BY `Score ProdTech Médio` DESC, `Seguradora` ASC;
```

### Filtros do Metabase

A query expõe dois filtros opcionais via sintaxe `[[ ... ]]`:

- `{{data_inicio}}` — recorte por data de criação da cotação (`dt_criacao_cotacao >= ?`)
- `{{seguradora}}` — filtro livre por seguradora

---

## Query Atual do Score ProdTech (Base Consolidada)

A query abaixo calcula o score diretamente a partir da tabela `tb_portal_parceiro_mvo_consolidado`.

### Lógica em camadas

- `base_dados` — seleciona as colunas necessárias da base consolidada e aplica os filtros de período e seguradora.
- `seguradoras_metricas` — calcula quantidade de clientes, percentual de emissão automática e percentual de sucesso de cotação.
- `integracoes_por_tipo` — conta, por seguradora e integração, a quantidade de linhas via API.
- `seguradoras_integracoes` — conta quantas integrações ativas a seguradora possui (`quantidade_linhas >= 5`).
- `base_final` — junta as métricas com a contagem de integrações ativas.
- `calculo_scores` — converte as métricas em scores discretos.

### Regras de score utilizadas nesta query

#### Score Features (`quantidade_integracoes`)

| quantidade_integracoes | score |
|---:|---:|
| 3 | 1 |
| 4 | 2 |
| 5 ou 6 | 3 |
| 7 | 4 |
| `>= 8` | 5 |
| outros | 0 |

#### Score Emissão Automática (`percentual_emissao_automatica`)

| Faixa | score |
|---|---:|
| `< 20%` | 1 |
| `20% – 40%` | 2 |
| `40% – 60%` | 3 |
| `60% – 80%` | 4 |
| `> 80%` | 5 |
| outros | 0 |

#### Score Sucesso Cotação (`percentual_sucesso_cotacao`)

| Faixa | score |
|---|---:|
| `< 30%` | 1 |
| `30% – 40%` | 2 |
| `40% – 50%` | 3 |
| `50% – 60%` | 4 |
| `> 60%` | 5 |
| outros | 0 |

#### Score Clientes (`quantidade_clientes`)

| Faixa | score |
|---|---:|
| `< 10` | 1 |
| `10 – 39` | 2 |
| `40 – 69` | 3 |
| `70 – 99` | 4 |
| `> 100` | 5 |
| outros | 0 |

### Query Completa

```sql
WITH base_dados AS (
    SELECT
        seguradora_cotacao,
        id_cliente,
        id_apolice,
        id_cotacao,
        integracao,
        vl_premio,
        data_emissao,
        fl_emissao_automatica,
        cotacao_manual
    FROM tb_portal_parceiro_mvo_consolidado
    WHERE 1=1
    [[AND {{periodo}}]]
    [[AND {{seguradora}}]]
),

seguradoras_metricas AS (
    SELECT
        COALESCE(NULLIF(UPPER(TRIM(seguradora_cotacao)), ''), 'SEM SEGURADORA') AS seguradora,

        COUNT(DISTINCT id_cliente) AS quantidade_clientes,

        COUNT(DISTINCT CASE
            WHEN vl_premio > 0
             AND data_emissao IS NOT NULL
             AND fl_emissao_automatica = 1
            THEN id_apolice
        END) * 1.0
        / NULLIF(
            COUNT(DISTINCT CASE
                WHEN vl_premio > 0
                 AND data_emissao IS NOT NULL
                THEN id_apolice
            END), 0
        ) AS percentual_emissao_automatica,

        COUNT(DISTINCT CASE
            WHEN vl_premio > 0
             AND data_emissao IS NOT NULL
            THEN id_apolice
        END) * 1.0
        / NULLIF(COUNT(DISTINCT id_cotacao), 0)
        AS percentual_sucesso_cotacao

    FROM base_dados
    GROUP BY COALESCE(NULLIF(UPPER(TRIM(seguradora_cotacao)), ''), 'SEM SEGURADORA')
),

integracoes_por_tipo AS (
    SELECT
        COALESCE(NULLIF(UPPER(TRIM(seguradora_cotacao)), ''), 'SEM SEGURADORA') AS seguradora,
        TRIM(integracao) AS integracao_normalizada,
        COUNT(*) AS quantidade_linhas
    FROM base_dados
    WHERE integracao IS NOT NULL
      AND TRIM(integracao) <> ''
      AND cotacao_manual = b'0'
    GROUP BY
        COALESCE(NULLIF(UPPER(TRIM(seguradora_cotacao)), ''), 'SEM SEGURADORA'),
        TRIM(integracao)
),

seguradoras_integracoes AS (
    SELECT
        seguradora,
        COUNT(*) AS quantidade_integracoes
    FROM integracoes_por_tipo
    WHERE quantidade_linhas >= 5
    GROUP BY seguradora
),

base_final AS (
    SELECT
        seguradoras_metricas.seguradora,
        COALESCE(seguradoras_integracoes.quantidade_integracoes, 0) AS quantidade_integracoes,
        seguradoras_metricas.quantidade_clientes,
        seguradoras_metricas.percentual_emissao_automatica,
        seguradoras_metricas.percentual_sucesso_cotacao
    FROM seguradoras_metricas
    LEFT JOIN seguradoras_integracoes
        ON seguradoras_metricas.seguradora = seguradoras_integracoes.seguradora
),

calculo_scores AS (
    SELECT
        seguradora,
        quantidade_integracoes,
        quantidade_clientes,
        percentual_emissao_automatica,
        percentual_sucesso_cotacao,

        CASE
            WHEN quantidade_integracoes = 3 THEN 1
            WHEN quantidade_integracoes = 4 THEN 2
            WHEN quantidade_integracoes IN (5, 6) THEN 3
            WHEN quantidade_integracoes = 7 THEN 4
            WHEN quantidade_integracoes >= 8 THEN 5
            ELSE 0
        END AS score_features,

        CASE
            WHEN percentual_emissao_automatica < 0.20 THEN 1
            WHEN percentual_emissao_automatica <= 0.40 THEN 2
            WHEN percentual_emissao_automatica <= 0.60 THEN 3
            WHEN percentual_emissao_automatica <= 0.80 THEN 4
            WHEN percentual_emissao_automatica > 0.80 THEN 5
            ELSE 0
        END AS score_emissao_automatica,

        CASE
            WHEN percentual_sucesso_cotacao < 0.30 THEN 1
            WHEN percentual_sucesso_cotacao <= 0.40 THEN 2
            WHEN percentual_sucesso_cotacao <= 0.50 THEN 3
            WHEN percentual_sucesso_cotacao <= 0.60 THEN 4
            WHEN percentual_sucesso_cotacao > 0.60 THEN 5
            ELSE 0
        END AS score_sucesso_cotacao,

        CASE
            WHEN quantidade_clientes < 10 THEN 1
            WHEN quantidade_clientes <= 39 THEN 2
            WHEN quantidade_clientes <= 69 THEN 3
            WHEN quantidade_clientes <= 99 THEN 4
            WHEN quantidade_clientes > 100 THEN 5
            ELSE 0
        END AS score_clientes

    FROM base_final
)

SELECT
    seguradora AS Seguradora,
    quantidade_integracoes AS Qtd_Integracoes,

    CONCAT(ROUND(percentual_emissao_automatica * 100, 2), '%') AS Percentual_Emissao_Automatica,
    CONCAT(ROUND(percentual_sucesso_cotacao * 100, 2), '%') AS Percentual_Sucesso_Cotacao,

    quantidade_clientes AS Qtd_Clientes,

    score_features AS Score_Features,
    score_emissao_automatica AS Score_Emissao_Automatica,
    score_sucesso_cotacao AS Score_Sucesso_Cotacao,
    score_clientes AS Score_Clientes,

    LEAST(
        5,
        GREATEST(
            0,
            ROUND(
                (score_features +
                 score_emissao_automatica +
                 score_sucesso_cotacao +
                 score_clientes) / 4.0
            , 2)
        )
    ) AS Score_ProdTech

FROM calculo_scores
ORDER BY Score_ProdTech DESC, Seguradora ASC;
```

### Filtros do Metabase

A query expõe dois filtros opcionais via sintaxe `[[ ... ]]`:

- `{{periodo}}` — filtro de período aplicado na base consolidada
- `{{seguradora}}` — filtro livre por seguradora

---

## Glossário de Colunas

### tb_portal_parceiro_mvp (principais)

| Coluna | Significado |
|---|---|
| id_cotacao | ID único da cotação (chave primária do funil) |
| id_apolice_cotacao | ID da apólice associada à cotação |
| dt_criacao_cotacao | Data de criação da cotação |
| seguradora_cotacao | Seguradora cotada (do lado do funil) |
| vl_premio_cotacao | Prêmio cotado |
| id_apolice | ID da apólice efetivamente emitida (`NULL` se não emitiu) |
| data_emissao | Data de emissão da apólice |
| seguradora_emissao | Seguradora que emitiu (pode diferir da cotada) |
| vl_premio | Prêmio da emissão |
| fl_apolice_emitida | 1 se virou apólice válida |
| fl_emissao_automatica | 1 se a emissão foi via API com sucesso |
| manual_vs_api | `api sucesso / api insucesso / manual sucesso / manual sem cotação` |
| api_manual | `API / Manual / API virou Manual` |
| cotacao_vencedora | `vencedora` se essa cotação virou apólice |
| saude_mktplace | Indicador de competitividade do marketplace |

### tb_portal_parceiro_integracoes

| Coluna | Significado |
|---|---|
| seguradora | Nome da seguradora |
| integracao | Nome da integração (1- Recursal a 7- Endosso) |
| qtd_api | Cotações via API daquela seguradora × integração |
| qtd_manual | Cotações manuais |
| cont_integracao | 1 se `qtd_api >= 5`, senão 0 (regra de integração ativa) |
| qtd_alfandega | Cotações totais via Alfândega para a seguradora (repetido em todas as linhas dela) |

### tb_portal_parceiro_mvo_consolidado

| Coluna | Significado |
|---|---|
| seguradora_cotacao | Nome da seguradora associada à cotação |
| id_cliente | ID do cliente |
| id_apolice | ID da apólice emitida |
| id_cotacao | ID único da cotação |
| integracao | Classificação da integração atribuída à linha |
| vl_premio | Valor do prêmio considerado nas métricas de emissão |
| data_emissao | Data de emissão da apólice |
| fl_emissao_automatica | 1 quando a emissão foi automática |
| cotacao_manual | Identifica se a cotação foi manual |

---

## Notas de Operação

- **Periodicidade:** o notebook deve rodar com a periodicidade de atualização desejada (ex.: diária).
- **Modo de carga:** `overwrite` no MySQL — a tabela é recriada a cada execução.
- **Parâmetro `DATA_INICIO`:** definido na célula 8 do notebook. Hoje fixado em `2025-05-01`. Cotações anteriores a essa data são filtradas das integrações.
- **Tabela `integracao_seguradora`:** existe em memória (notebook) e na tabela MySQL `tb_portal_parceiro_integracoes`. Para visualizações ad-hoc no notebook, basta um `display(integracao_seguradora)` na última célula.
- **Capitalização de seguradora:** o `df_base_1_7` mantém o nome original do banco; a Alfândega usa `UPPER+TRIM`. O join na query final compara os dois em `UPPER+TRIM`, então não importa a capitalização armazenada.
- **Base consolidada:** a tabela `tb_portal_parceiro_mvo_consolidado` pode ser utilizada diretamente em análises e painéis que precisem de uma leitura única do funil e das integrações.
