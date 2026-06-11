# Changelog

Todas as mudanças importantes do projeto serão documentadas neste arquivo.

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
