# Changelog

Todas as mudanças importantes do projeto serão documentadas neste arquivo.

## [Manutenção Tab] - 2026-06-11

### 🔧 Tab de Manutenção Implementada

#### Substituição de Tab
- **Tab Motoristas removida** - Substituída pela tab de Manutenção
- **Tab Manutenção adicionada** - Gestão completa de manutenções de veículos

#### Nova Tela Criada

**src/screens/maintenance/MaintenanceScreen.tsx** - Tab Manutenção
- Lista de manutenções de veículos
- Painel de resumo (Total: 4, Pendentes, Custo Total)
- Informações detalhadas:
  - Nome e placa do veículo
  - Tipo de manutenção
  - Descrição
  - Data
  - Custo formatado em R$
- Status com badges:
  - 🔵 **Pendente** - Badge info/azul
  - 🟡 **Em Andamento** - Badge warning/amarelo
  - 🟢 **Concluída** - Badge success/verde
- Ícones indicativos para cada campo
- Botão de adicionar manutenção
- Dados mockados de 4 manutenções

#### Atualizações

- **src/navigation/TabNavigator.tsx**
  - Import alterado de DriversScreen para MaintenanceScreen
  - TabParamList atualizado: Drivers → Maintenance
  - Tab Screen atualizada com ícone "construct"
  - Label alterado para "Manutenção"

- **src/screens/menu/MenuScreen.tsx**
  - Menu item "Motoristas" substituído por "Manutenção"
  - Ícone alterado de "people-outline" para "construct-outline"
  - Cor ajustada para accent (laranja)
  - Subtitle: "Gestão de manutenções"

- **README.md**
  - Seção de navegação atualizada
  - Estrutura de pastas atualizada
  - Documentação da tab Manutenção

#### Dados Mockados

```typescript
// 4 manutenções de exemplo
- Toyota Corolla (ABC-1234): Troca de óleo - R$ 250,00 (Pendente)
- Honda Civic (DEF-5678): Revisão 10.000 km - R$ 450,00 (Em Andamento)
- Volkswagen Polo (GHI-9012): Troca de pastilhas - R$ 380,00 (Concluída)
- Fiat Argo (JKL-3456): Alinhamento - R$ 150,00 (Concluída)
```

#### Recursos da Tela de Manutenção

- ✅ Formatação de moeda em Real (R$)
- ✅ Formatação de data em pt-BR
- ✅ Cards clicáveis com feedback visual
- ✅ Resumo com total de manutenções e custo total
- ✅ Ícones contextuais (carro, ferramentas, calendário, dinheiro)
- ✅ Layout responsivo com scroll
- ✅ Integração completa com design system

### 📊 Estatísticas

- **1 arquivo criado** (MaintenanceScreen.tsx)
- **3 arquivos modificados** (TabNavigator, MenuScreen, README)
- **Tab Motoristas substituída** por Tab Manutenção
- **4 manutenções mockadas** para demonstração

## [Bottom Tabs Navigator] - 2026-06-11

### 🧭 Navegação Implementada

#### Bottom Tab Navigator
- **src/navigation/TabNavigator.tsx** - Navegador de tabs inferior
  - 4 tabs principais (Menu, Veículos, Motoristas, Configurações)
  - Ícones do Ionicons
  - Cores dinâmicas baseadas no tema
  - Height de 60px com padding
  - Border superior sutil

#### Novas Telas Criadas

1. **src/screens/menu/MenuScreen.tsx** - Tab Menu (Principal)
   - Header com avatar e saudação do usuário
   - 4 cards de menu com ícones coloridos
   - Menu items: Veículos, Motoristas, Relatórios, Notificações
   - Layout em scroll vertical
   - Integração completa com tema

2. **src/screens/vehicles/VehiclesScreen.tsx** - Tab Veículos
   - Lista de veículos com FlatList
   - Painel de resumo (Total, Ativos, Manutenção)
   - Cards com informações (Marca, Modelo, Placa, Ano)
   - Badges de status (Ativo, Manutenção, Inativo)
   - Botão de adicionar veículo
   - Dados mockados de 4 veículos

3. **src/screens/drivers/DriversScreen.tsx** - Tab Motoristas
   - Lista de motoristas com avatares
   - Painel de resumo (Total, Ativos, Total de Viagens)
   - Informações detalhadas (Email, Telefone, Viagens)
   - Badges de status
   - Botão de adicionar motorista
   - Dados mockados de 4 motoristas

4. **src/screens/settings/SettingsScreen.tsx** - Tab Configurações
   - Card de perfil do usuário com avatar grande
   - Seções organizadas:
     - **Conta**: Editar Perfil, Alterar Senha, Privacidade
     - **Aplicativo**: Notificações, Tema, Idioma
     - **Suporte**: Central de Ajuda, Sobre
   - Botão de logout com confirmação
   - Footer com versão do app

#### Navegação Atualizada

- **src/navigation/AppRoutes.tsx** - Modificado
  - Agora usa TabNavigator em vez de DashboardScreen direto
  - Stack Navigator envolve o TabNavigator
  - Mantém compatibilidade com autenticação

#### Documentação

- **docs/bottom-tabs-navigator.md**
  - Guia completo do sistema de tabs
  - Documentação de cada tab
  - Exemplos de uso e navegação
  - Como adicionar novas tabs
  - Lista de ícones disponíveis

- **README.md** - Atualizado
  - Seção de navegação adicionada
  - Estrutura de projeto atualizada
  - Link para documentação do Bottom Tabs

### 🎨 Características

- **Consistência Visual**: Todas as telas seguem o design system
- **Dados Mockados**: 4 veículos e 4 motoristas para teste
- **Interatividade**: Cards clicáveis com feedback visual
- **Resumos**: Painéis de métricas em todas as listas
- **Status Badges**: Identificação visual de status
- **Ícones**: Ionicons em toda navegação
- **Responsivo**: Scroll automático em listas

### 📊 Estatísticas

- **5 arquivos criados** (4 telas + 1 navegador)
- **2 arquivos modificados** (AppRoutes + README)
- **1 documentação criada** (bottom-tabs-navigator.md)
- **4 tabs implementadas**
- **8 itens de dados mockados** (4 veículos + 4 motoristas)

## [Sistema de Design] - 2025-01-XX

### 🎨 Adicionado

#### Sistema de Tema Completo
- **src/theme/index.ts** - Definições principais do tema
  - Paleta de cores com 9 escalas (primary, secondary, accent, danger, warning, info, success, gray, semantic)
  - Sistema de espaçamento baseado em 4px (xxs a xxxl)
  - Tipografia com fontSize, fontWeight e lineHeight
  - Border radius (none a full)
  - Sistema de sombras com elevation
  - Valores de opacidade
  - Constantes de layout

- **src/theme/tokens.ts** - Tokens semânticos
  - Variantes de botões (primary, secondary, outline, ghost, danger)
  - Estados de input (default, focused, error, disabled)
  - Estilos de card (default, elevated, outlined)
  - Cores de status
  - Tamanhos de ícones

#### Componentes Atualizados

- **src/components/Button/index.tsx**
  - Integração completa com o tema
  - Adicionado suporte para 5 variantes (primary, secondary, outline, ghost, danger)
  - Adicionado suporte para 3 tamanhos (sm, md, lg)
  - Uso de buttonVariants do tokens.ts
  - Melhor tipagem TypeScript

- **src/components/Input/index.tsx**
  - Integração completa com o tema
  - Estados visuais baseados em foco e erro
  - Suporte para ícones à esquerda e direita
  - Texto auxiliar (helperText)
  - Cores dinâmicas baseadas em estado

- **src/components/Loading/index.tsx**
  - Integração com cores do tema
  - Suporte para cor customizada
  - Mensagem de carregamento opcional

#### Novos Componentes

- **src/components/Card/index.tsx**
  - Container reutilizável com 3 variantes
  - Suporte para padding customizado
  - Pode ser touchable com onPress
  - Integração completa com tema

- **src/components/Avatar/index.tsx**
  - Exibição de iniciais ou imagem de perfil
  - 4 tamanhos disponíveis (sm, md, lg, xl)
  - Cores customizáveis
  - Fallback para "?" quando sem nome
  - Geração automática de iniciais

- **src/components/Badge/index.tsx**
  - Etiquetas de status coloridas
  - 5 variantes (success, warning, error, info, neutral)
  - 3 tamanhos (sm, md, lg)
  - Border radius circular

#### Telas Atualizadas

- **src/screens/auth/LoginScreen.tsx**
  - Migração completa para o novo tema
  - Uso de spacing, colors e typography do tema
  - Visual mais profissional e consistente

- **src/screens/dashboard/DashboardScreen.tsx**
  - Migração completa para o novo tema
  - Uso do componente Card para informações do usuário
  - Uso do componente Avatar para foto do perfil
  - Layout mais moderno e atraente

#### Documentação

- **docs/design-system.md**
  - Guia completo do sistema de design
  - Documentação de todas as cores
  - Exemplos de uso de componentes
  - Boas práticas de desenvolvimento
  - Convenções de código

- **README.md** - Atualizado
  - Seção sobre sistema de design
  - Documentação de componentes
  - Exemplos de uso do tema
  - Estrutura de projeto atualizada

### 🔧 Modificado

- Todos os componentes agora usam theme tokens ao invés de valores hardcoded
- Estilos agora são baseados em constantes reutilizáveis
- TypeScript stricto com interfaces completas
- Melhor acessibilidade e usabilidade

### ✨ Melhorias

- **Consistência Visual**: Todo o app agora segue o mesmo padrão de design
- **Manutenibilidade**: Alterações no tema afetam todo o app automaticamente
- **Escalabilidade**: Fácil adicionar novos componentes seguindo o mesmo padrão
- **Developer Experience**: Autocompletion e type safety com TypeScript
- **Performance**: Componentes otimizados e reutilizáveis

## [Autenticação Completa] - 2025-01-XX

### ✅ Funcionalidades Implementadas

#### Dia 9 - Estrutura do Projeto
- Criação completa da estrutura de pastas
- Organização escalável e modular

#### Dia 10 - Serviço API
- Configuração do Axios com interceptors
- Tratamento global de erros
- Serviços de autenticação (login, logout, me)

#### Dia 11 - Tela de Login
- Interface moderna e responsiva
- Validação com React Hook Form + Zod
- Feedback visual de erros

#### Dia 12 - Integração Laravel
- Integração completa com API Laravel Sanctum
- Navegação automática após login
- Dashboard funcional

#### Dia 13 - Persistência do Token
- AsyncStorage implementado
- Login automático ao abrir o app
- Validação de token ao iniciar

#### Dia 14 - Logout
- Logout com confirmação
- Revogação de token na API
- Limpeza completa da sessão local

### 🐛 Problemas Resolvidos

- Conexão com API (porta 8000 ausente)
- CORS no Laravel
- AsyncStorage não instalado
- PowerShell execution policy
- Servidor Laravel não acessível externamente

## [Inicial] - 2025-01-XX

### 🚀 Criação do Projeto

- Setup inicial com Expo
- Configuração TypeScript
- Estrutura de pastas base
- Dependências principais instaladas
