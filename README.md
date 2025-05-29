# Budget Buddy - Sistema de Gestão Financeira

Budget Buddy é um sistema completo de gestão financeira desenvolvido para ajudar usuários a gerenciar suas finanças pessoais e de negócios de forma eficiente e intuitiva.

## Tecnologias Utilizadas

### Frontend
- **React + Vite**: Framework JavaScript moderno para construção da interface do usuário
- **Chart.js**: Biblioteca para criação de gráficos interativos e visualizações de dados
- **React Router**: Gerenciamento de rotas e navegação
- **CSS Modules**: Estilização modular e responsiva

### Backend
- **Flask**: Framework Python para construção da API REST
- **SQLAlchemy**: ORM para interação com o banco de dados
- **SQLite**: Banco de dados relacional para armazenamento persistente
- **Flask-CORS**: Middleware para permitir requisições cross-origin

## Arquitetura do Sistema

### Frontend
O frontend é construído como uma Single Page Application (SPA) com os seguintes componentes principais:

1. **Dashboard**: Visão geral das finanças
   - Resumo financeiro
   - Gráficos de gastos e receitas
   - Lista de orçamentos
   - Transações recentes

2. **Componentes de Visualização**
   - `OverallStats`: Estatísticas gerais com gráficos de barras e pizza
   - `StoreStats`: Estatísticas específicas por loja
   - `MonthlyStats`: Análise mensal de transações
   - `SimpleCharts`: Visualizações básicas de transações diárias

3. **Componentes de Gestão**
   - `AddBudgetForm`: Criação de novos orçamentos
   - `AddExpenseForm`: Registro de despesas e receitas
   - `Table`: Exibição de transações em formato tabular
   - `CategoryManager`: Gerenciamento de categorias

### Backend
O backend segue uma arquitetura RESTful com os seguintes elementos:

1. **Modelos de Dados**
   ```python
   class User:
       id: UUID
       name: String
       created_at: DateTime
       budgets: Relationship[Budget]

   class Budget:
       id: UUID
       name: String
       amount: Float
       color: String
       categories: String
       user_id: UUID
       expenses: Relationship[Expense]

   class Expense:
       id: UUID
       name: String
       amount: Float
       type: String
       category: String
       created_at: DateTime
       budget_id: UUID
   ```

2. **Endpoints da API**
   - `/api/user`: Gerenciamento de usuários
   - `/api/budgets`: Operações com orçamentos
   - `/api/expenses`: Gestão de despesas e receitas

## Estrutura do Banco de Dados

### Tabelas e Relacionamentos

1. **Users**
   - Chave primária: `id` (UUID)
   - Campos: `name`, `created_at`
   - Relacionamento 1:N com Budgets

2. **Budgets**
   - Chave primária: `id` (UUID)
   - Chave estrangeira: `user_id` → Users
   - Campos: `name`, `amount`, `color`, `categories`
   - Relacionamento 1:N com Expenses

3. **Expenses**
   - Chave primária: `id` (UUID)
   - Chave estrangeira: `budget_id` → Budgets
   - Campos: `name`, `amount`, `type`, `category`, `created_at`

## Lógica de Negócio

### Gestão de Orçamentos
1. **Criação de Orçamento**
   - Definição de nome e valor total
   - Seleção de categorias
   - Atribuição de cor para identificação visual

2. **Categorização**
   - Categorias personalizadas por orçamento
   - Agrupamento de despesas por categoria
   - Análise de gastos por categoria

### Gestão de Transações
1. **Registro de Despesas**
   - Nome e valor
   - Categoria
   - Data e hora
   - Orçamento associado

2. **Registro de Receitas**
   - Mesma estrutura das despesas
   - Valores positivos vs. negativos
   - Categorização específica

### Análise e Estatísticas

1. **Cálculos Financeiros**
   - Total de receitas e despesas
   - Saldo líquido
   - Média de transações
   - Maiores gastos e receitas

2. **Visualizações**
   - Gráficos de barras para comparação mensal
   - Gráficos de pizza para distribuição de categorias
   - Gráficos de linha para tendências temporais
   - Tabelas para dados detalhados

3. **Métricas por Loja**
   - Análise individual de cada estabelecimento
   - Comparação entre lojas
   - Tendências de vendas e gastos

## Fluxo de Dados

1. **Entrada de Dados**
   - Interface do usuário → API REST
   - Validação de dados
   - Persistência no banco de dados

2. **Processamento**
   - Agregação de dados
   - Cálculos estatísticos
   - Geração de visualizações

3. **Saída**
   - Renderização de gráficos
   - Exibição de tabelas
   - Exportação de relatórios

## Segurança e Validação

1. **Validação de Dados**
   - Verificação de tipos
   - Validação de valores
   - Sanitização de entradas

2. **Segurança**
   - CORS configurado
   - Validação de usuários
   - Proteção contra injeção SQL

## Interface do Usuário

1. **Design Responsivo**
   - Adaptação para diferentes dispositivos
   - Layout fluido
   - Componentes reutilizáveis

2. **Componentes Visuais**
   - Cards informativos
   - Gráficos interativos
   - Tabelas ordenáveis
   - Formulários intuitivos

## Desenvolvimento e Manutenção

1. **Estrutura do Projeto**
   ```
   Budget_Buddy/
   ├── frontend/
   │   ├── public/
   │   │   ├── favicon.ico
   │   │   └── index.html
   │   ├── src/
   │   │   ├── components/
   │   │   │   ├── AddBudgetForm.jsx
   │   │   │   ├── AddExpenseForm.jsx
   │   │   │   ├── BudgetItem.jsx
   │   │   │   ├── CategoryManager.jsx
   │   │   │   ├── ExpenseItem.jsx
   │   │   │   ├── Intro.jsx
   │   │   │   ├── LoadingSpinner.jsx
   │   │   │   ├── MonthlyStats.jsx
   │   │   │   ├── OverallStats.jsx
   │   │   │   ├── SimpleCharts.jsx
   │   │   │   ├── StoreStats.jsx
   │   │   │   └── Table.jsx
   │   │   ├── pages/
   │   │   │   ├── BudgetPage.jsx
   │   │   │   ├── Dashboard.jsx
   │   │   │   └── ErrorPage.jsx
   │   │   ├── styles/
   │   │   │   ├── index.css
   │   │   │   └── StoreStats.css
   │   │   ├── App.jsx
   │   │   ├── api.jsx
   │   │   ├── helpers.js
   │   │   └── main.jsx
   │   ├── package.json
   │   ├── vite.config.js
   │   └── README.md
   │
   └── backend/
       ├── instance/
       │   └── budget_buddy.db
       ├── app.py
       ├── models.py
       ├── sample_data.py
       ├── requirements.txt
       └── README.md
   ```

2. **Descrição dos Componentes**

   **Frontend**
   - `components/`: Componentes React reutilizáveis
     - `AddBudgetForm.jsx`: Formulário para criar novos orçamentos
     - `AddExpenseForm.jsx`: Formulário para adicionar despesas/receitas
     - `BudgetItem.jsx`: Exibição individual de orçamento
     - `CategoryManager.jsx`: Gerenciamento de categorias
     - `ExpenseItem.jsx`: Exibição individual de transação
     - `MonthlyStats.jsx`: Estatísticas mensais
     - `OverallStats.jsx`: Estatísticas gerais
     - `StoreStats.jsx`: Estatísticas por loja
     - `Table.jsx`: Tabela de transações

   - `pages/`: Páginas principais da aplicação
     - `Dashboard.jsx`: Página inicial com visão geral
     - `BudgetPage.jsx`: Página de detalhes do orçamento
     - `ErrorPage.jsx`: Página de erro

   - `styles/`: Arquivos CSS
     - `index.css`: Estilos globais
     - `StoreStats.css`: Estilos específicos para estatísticas

   **Backend**
   - `app.py`: Aplicação principal Flask
   - `models.py`: Definições dos modelos de dados
   - `sample_data.py`: Script para gerar dados de exemplo
   - `requirements.txt`: Dependências Python
   - `instance/`: Diretório do banco de dados SQLite

3. **Dependências**
   - Frontend: React, Chart.js, React Router
   - Backend: Flask, SQLAlchemy, Flask-CORS

4. **Configuração**
   - Variáveis de ambiente
   - Configuração do banco de dados
   - Configuração do servidor

## Conclusão

O Budget Buddy é um sistema robusto e flexível para gestão financeira, oferecendo uma interface intuitiva e recursos avançados de análise de dados. Sua arquitetura modular permite fácil manutenção e expansão de funcionalidades. 