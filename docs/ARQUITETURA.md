# Arquitetura do Driver Control

## 📐 Visão Geral da Arquitetura

Este documento explica em detalhes a arquitetura e as decisões técnicas do aplicativo Driver Control.

## 🏛️ Princípios Aplicados

### SOLID

1. **Single Responsibility Principle (SRP)**
   - Cada componente tem uma única responsabilidade
   - Serviços separados para diferentes domínios (auth, api)
   - Componentes isolados e reutilizáveis

2. **Open/Closed Principle (OCP)**
   - Componentes abertos para extensão através de props
   - Estilos customizáveis sem modificar código interno

3. **Liskov Substitution Principle (LSP)**
   - Componentes seguem interfaces consistentes
   - Props tipadas com TypeScript

4. **Interface Segregation Principle (ISP)**
   - Interfaces específicas para cada contexto (auth.ts, api.ts)
   - Props opcionais para flexibilidade

5. **Dependency Inversion Principle (DIP)**
   - Dependência de abstrações (tipos TypeScript)
   - Injeção de dependências via Context API

### Clean Code

- **Nomenclatura clara**: Funções e variáveis com nomes descritivos
- **Funções pequenas**: Cada função faz uma coisa
- **Comentários úteis**: Documentação JSDoc em pontos críticos
- **DRY (Don't Repeat Yourself)**: Código reutilizável
- **Tratamento de erros**: Try/catch em operações assíncronas

## 📦 Detalhamento dos Módulos

### 1. Types (`src/types/`)

**Responsabilidade**: Definições TypeScript para type safety em toda aplicação.

#### `auth.ts`
```typescript
- User: Interface do usuário
- LoginCredentials: Dados de login
- RegisterData: Dados de registro
- AuthResponse: Resposta da API de autenticação
- AuthContextData: Contrato do Context de autenticação
```

#### `api.ts`
```typescript
- ApiResponse: Resposta padrão da API
- ApiError: Estrutura de erros
- ValidationError: Erros de validação
```

**Benefícios**:
- Type safety em tempo de compilação
- Autocomplete no editor
- Documentação viva do código

---

### 2. Storage (`src/storage/`)

**Responsabilidade**: Persistência local de dados usando AsyncStorage.

#### `authStorage.ts`

**Funções**:
- `saveToken()`: Salva token de autenticação
- `getToken()`: Recupera token
- `removeToken()`: Remove token
- `saveUser()`: Salva dados do usuário
- `getUser()`: Recupera dados do usuário
- `removeUser()`: Remove dados do usuário
- `clearAuth()`: Limpa toda autenticação

**Padrões Aplicados**:
- Tratamento de erros com try/catch
- Funções assíncronas (async/await)
- Serialização automática (JSON.stringify/parse)
- Chaves prefixadas para evitar conflitos

---

### 3. Services (`src/services/`)

**Responsabilidade**: Comunicação com APIs externas.

#### `api.ts`

**Configuração**:
- BaseURL configurável
- Timeout de 30 segundos
- Headers padrão (Content-Type, Accept)

**Interceptor de Requisição**:
- Adiciona token Bearer automaticamente
- Recupera token do AsyncStorage

**Interceptor de Resposta**:
- Tratamento global de erros
- Mapeamento de status HTTP
- Mensagens de erro amigáveis

**Códigos HTTP Tratados**:
- 401: Token inválido/expirado
- 403: Acesso negado
- 404: Recurso não encontrado
- 422: Erro de validação
- 500: Erro do servidor

#### `authService.ts`

**Funções**:
- `login()`: Autentica usuário
- `register()`: Registra novo usuário
- `me()`: Busca dados do usuário autenticado
- `logout()`: Revoga token

**Padrões**:
- Tipagem forte de requisições/respostas
- Propagação de erros para tratamento na camada superior
- Uso da instância Axios configurada

---

### 4. Contexts (`src/contexts/`)

**Responsabilidade**: Gerenciamento de estado global.

#### `AuthContext.tsx`

**Estado Gerenciado**:
- `user`: Dados do usuário autenticado
- `token`: Token de autenticação
- `loading`: Estado de carregamento inicial

**Funções**:
- `signIn()`: Realiza login
- `signOut()`: Realiza logout
- `loadStorageData()`: Recupera sessão salva
- `handleInvalidSession()`: Limpa sessão inválida

**Fluxo de Inicialização**:
1. Componente monta
2. `loadStorageData()` é chamado
3. Verifica token e usuário no AsyncStorage
4. Se existir, valida token com API
5. Se válido, mantém usuário logado
6. Se inválido, limpa sessão
7. Define `loading = false`

**Tratamento de Erros**:
- Erros específicos por status HTTP
- Mensagens amigáveis ao usuário
- Limpeza automática em caso de erro

**Hook `useAuth()`**:
- Facilita acesso ao contexto
- Valida uso dentro do Provider
- Type-safe

---

### 5. Components (`src/components/`)

**Responsabilidade**: Componentes UI reutilizáveis.

#### `Button/index.tsx`

**Props**:
- `title`: Texto do botão
- `loading`: Estado de carregamento
- `variant`: Estilo (primary, secondary, outline)
- `disabled`: Desabilita botão
- Herda todas props de `TouchableOpacity`

**Variantes**:
- **Primary**: Fundo azul, texto branco
- **Secondary**: Fundo roxo, texto branco
- **Outline**: Borda azul, texto azul, fundo transparente

**Estados**:
- Normal
- Disabled (opacidade reduzida)
- Loading (mostra ActivityIndicator)

#### `Input/index.tsx`

**Props**:
- `label`: Rótulo do campo
- `error`: Mensagem de erro
- `containerStyle`: Estilo do container
- Herda todas props de `TextInput`

**Features**:
- ForwardRef para controle via ref
- Erro visual (borda vermelha)
- Mensagem de erro abaixo do campo
- Placeholder com cor customizada

#### `Loading/index.tsx`

**Props**:
- `message`: Mensagem opcional

**Uso**:
- Tela de loading durante inicialização
- Carregamento de dados
- Processamento assíncrono

---

### 6. Screens (`src/screens/`)

**Responsabilidade**: Telas completas do aplicativo.

#### `auth/LoginScreen.tsx`

**Tecnologias**:
- React Hook Form para gerenciamento de formulário
- Zod para validação
- KeyboardAvoidingView para UX mobile

**Validações**:
- Email obrigatório e válido
- Senha obrigatória (mínimo 8 caracteres)

**Fluxo**:
1. Usuário preenche formulário
2. Validação client-side (Zod)
3. Submit do formulário
4. Chamada `signIn()` do Context
5. Loading durante requisição
6. Sucesso: Navega automaticamente (Context gerencia)
7. Erro: Exibe Alert com mensagem

**UX**:
- Feedback visual de erros
- Loading no botão
- Campos desabilitados durante loading
- Links para criar conta e recuperar senha

#### `dashboard/DashboardScreen.tsx`

**Funcionalidades**:
- Exibe dados do usuário (nome, email)
- Botão de logout
- Confirmação antes de sair

**Fluxo de Logout**:
1. Usuário clica em "Sair"
2. Alert de confirmação
3. Se confirmar, chama `signOut()`
4. Revoga token na API
5. Limpa AsyncStorage
6. Navega para Login (automático via Context)

---

### 7. Navigation (`src/navigation/`)

**Responsabilidade**: Gerenciamento de rotas e navegação.

#### `AuthRoutes.tsx`
- Stack para rotas públicas
- Contém: Login (futuramente: Register, ForgotPassword)

#### `AppRoutes.tsx`
- Stack para rotas privadas (autenticadas)
- Contém: Dashboard (futuramente: outras telas do app)

#### `index.tsx`
- Componente principal de navegação
- Decide qual stack renderizar baseado em `user`
- Exibe Loading enquanto verifica autenticação

**Fluxo de Decisão**:
```
loading = true
  ↓
<Loading />

loading = false && user = null
  ↓
<AuthRoutes />

loading = false && user != null
  ↓
<AppRoutes />
```

---

## 🔄 Fluxos Principais

### Fluxo de Login

```
1. Usuário abre app
2. App.tsx renderiza
3. AuthProvider inicializa
4. loadStorageData() verifica AsyncStorage
5. Não tem token → loading = false, user = null
6. Routes renderiza AuthRoutes
7. LoginScreen é exibida
8. Usuário preenche credenciais
9. Validação Zod
10. signIn(credentials)
11. authService.login() chama API
12. API retorna { user, token }
13. Salva no AsyncStorage
14. Atualiza state (user, token)
15. Routes detecta user != null
16. Renderiza AppRoutes
17. DashboardScreen é exibida
```

### Fluxo de Logout

```
1. Usuário clica "Sair" no Dashboard
2. Alert de confirmação
3. Usuário confirma
4. signOut() é chamado
5. authService.logout() revoga token na API
6. Limpa AsyncStorage (token, user)
7. Atualiza state (user = null, token = null)
8. Routes detecta user = null
9. Renderiza AuthRoutes
10. LoginScreen é exibida
```

### Fluxo de Restauração de Sessão

```
1. Usuário abre app (já logado anteriormente)
2. App.tsx renderiza
3. AuthProvider inicializa
4. loadStorageData() verifica AsyncStorage
5. Tem token e user salvos
6. Valida token com authService.me()
7. API retorna dados atualizados do user
8. Atualiza user no state
9. loading = false
10. Routes detecta user != null
11. Renderiza AppRoutes
12. DashboardScreen é exibida
```

## 🛡️ Segurança

### Armazenamento de Token
- AsyncStorage (não é totalmente seguro, mas adequado para MVP)
- Para produção: considerar expo-secure-store

### Interceptor de Autenticação
- Token adicionado automaticamente em todas requisições
- Header: `Authorization: Bearer TOKEN`

### Validação de Token
- Validação ao iniciar app
- Limpeza automática se token inválido

### Tratamento de Erros
- Erros 401 limpam sessão automaticamente
- Mensagens não expõem informações sensíveis

## 📊 Boas Práticas Implementadas

### TypeScript
- ✅ Tipagem forte em toda aplicação
- ✅ Interfaces para contratos
- ✅ Type inference
- ✅ Generics em funções utilitárias

### React/React Native
- ✅ Hooks modernos
- ✅ Context API para estado global
- ✅ Componentes funcionais
- ✅ Memo e callbacks quando necessário

### Código
- ✅ Nomenclatura descritiva
- ✅ Funções pequenas e focadas
- ✅ Comentários JSDoc
- ✅ Tratamento de erros
- ✅ Código DRY

### Estrutura
- ✅ Separação de responsabilidades
- ✅ Modularização
- ✅ Escalabilidade
- ✅ Fácil manutenção

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Implementar tela de registro
- [ ] Adicionar recuperação de senha
- [ ] Melhorar feedback visual de erros
- [ ] Adicionar animações

### Médio Prazo
- [ ] Implementar refresh token
- [ ] Adicionar tema dark/light
- [ ] Implementar internacionalização (i18n)
- [ ] Adicionar testes unitários

### Longo Prazo
- [ ] Migrar para expo-secure-store
- [ ] Implementar biometria
- [ ] Adicionar testes E2E
- [ ] Implementar CI/CD

## 📚 Documentação Adicional

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
