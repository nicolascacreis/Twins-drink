
# Portal Parceiro MVP — Documentação Atualizada (Base: tb_portal_parceiro_mvo_consolidado)

## Visão Geral

Esta versão do cálculo de score ProdTech foi **simplificada** para utilizar exclusivamente a tabela consolidada:

**tb_portal_parceiro_mvo_consolidado**

Diferente da versão anterior, **não há mais separação entre tabelas de integrações e base analítica**, nem dependência da Alfândega como dimensão separada.

Toda a lógica agora é derivada diretamente da base consolidada.

---

## Estrutura da Base Utilizada

Tabela única:

- `tb_portal_parceiro_mvo_consolidado`

Principais colunas utilizadas:

- `seguradora_cotacao`
- `id_cliente`
- `id_apolice`
- `id_cotacao`
- `integracao`
- `vl_premio`
- `data_emissao`
- `fl_emissao_automatica`
- `cotacao_manual`

---

## Lógica de Construção do Score

O cálculo segue 4 etapas principais:

1. Base filtrada
2. Cálculo de métricas por seguradora
3. Cálculo de integrações ativas
4. Conversão em score

---

## 1. Base de Dados

A base considera:

- Filtros opcionais de período e seguradora
- Apenas registros válidos da tabela consolidada

---

## 2. Métricas por Seguradora

Agrupamento por:

```
UPPER(TRIM(seguradora_cotacao))
```

### Métricas calculadas

#### Quantidade de Clientes

```
COUNT(DISTINCT id_cliente)
```

---

#### % Emissão Automática

```
(qtd_apolices_automaticas) / (qtd_apolices_emitidas)
```

Onde:

- Apólice automática:
  - `vl_premio > 0`
  - `data_emissao IS NOT NULL`
  - `fl_emissao_automatica = 1`

- Apólice emitida:
  - `vl_premio > 0`
  - `data_emissao IS NOT NULL`

---

#### % Sucesso Cotação

```
(qtd_apolices_emitidas) / (qtd_cotacoes)
```

Onde:

- Apólice emitida:
  - `vl_premio > 0`
  - `data_emissao IS NOT NULL`

- Cotação:
  - `COUNT(DISTINCT id_cotacao)`

---

## 3. Cálculo de Integrações

### Regra

Uma integração é considerada ativa quando:

```
>= 5 cotações via API
```

### Como é calculado

1. Filtra apenas cotações **via API**:

```
cotacao_manual = 0
```

2. Agrupa por:

- seguradora
- integração

3. Conta quantidade de linhas por integração

4. Conta quantas integrações têm:

```
quantidade_linhas >= 5
```

Resultado:

```
quantidade_integracoes
```

### Importante

- Integrações são derivadas da própria coluna `integracao`
- Não existe mais lógica separada por regra 1–7 ou Alfândega

---

## 4. Regras de Score

### 4.1 Score Features (Integrações)

| Integrações | Score |
|------------|------|
| 3 | 1 |
| 4 | 2 |
| 5 ou 6 | 3 |
| 7 | 4 |
| >= 8 | 5 |
| outros | 0 |

---

### 4.2 Score Emissão Automática

| Faixa | Score |
|------|------|
| < 20% | 1 |
| 20% – 40% | 2 |
| 40% – 60% | 3 |
| 60% – 80% | 4 |
| > 80% | 5 |
| outros | 0 |

---

### 4.3 Score Sucesso Cotação

| Faixa | Score |
|------|------|
| < 30% | 1 |
| 30% – 40% | 2 |
| 40% – 50% | 3 |
| 50% – 60% | 4 |
| > 60% | 5 |
| outros | 0 |

---

### 4.4 Score Clientes

| Faixa | Score |
|------|------|
| < 10 | 1 |
| 10 – 39 | 2 |
| 40 – 69 | 3 |
| 70 – 99 | 4 |
| > 100 | 5 |
| outros | 0 |

---

## 5. Score Final (ProdTech)

Cálculo:

```
(score_features + score_emissao_automatica + score_sucesso_cotacao + score_clientes) / 4
```

### Regras adicionais

- Arredondado para 2 casas
- Limitado entre 0 e 5

---


## Conclusão

O modelo atual elimina a necessidade de pipelines paralelos e centraliza toda a inteligência em uma única fonte confiável, garantindo consistência nos cálculos e maior simplicidade operacional.

