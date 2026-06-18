# Facility Car App 🚗

Aplicativo mobile para controle de motoristas e veículos, desenvolvido com React Native e Expo.

## 📱 Tecnologias

- **React Native** 0.81.5
- **Expo** ~54.0.34
- **TypeScript** ~5.9.2
- **React Navigation** 7.3.1
- **Axios** 1.17.0
- **React Hook Form** 7.78.0
- **Zod** 4.4.3
- **AsyncStorage** 2.1.4

## 🎨 Sistema de Design

O aplicativo possui um **sistema de design completo e profissional** com:

- ✨ Paleta de cores consistente e moderna
- 📏 Espaçamento padronizado (sistema de 4px)
- ✍️ Tipografia escalável e responsiva
- 🎯 Componentes reutilizáveis e customizáveis
- 🔧 Tokens semânticos para fácil manutenção

📖 **Veja a documentação completa em** [docs/design-system.md](docs/design-system.md)

## 📁 Estrutura do Projeto

```
facility_car_app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Avatar/          # Avatar com iniciais ou imagem
│   │   ├── Badge/           # Etiquetas de status
│   │   ├── Button/          # Botão com variantes
│   │   ├── Card/            # Container com estilos
│   │   ├── Input/           # Campo de entrada
│   │   └── Loading/         # Indicador de carregamento
│   │
│   ├── contexts/            # Contextos do React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   │
│   ├── navigation/          # Navegação
│   │   ├── TabNavigator.tsx # Bottom Tabs Navigator (4 tabs)
│   │   ├── AppRoutes.tsx    # Rotas autenticadas
│   │   ├── AuthRoutes.tsx   # Rotas públicas
│   │   └── index.tsx        # Navegador principal
│   │
│   ├── screens/             # Telas
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── menu/
│   │   │   └── MenuScreen.tsx         # Tab 1: Menu principal
│   │   ├── vehicles/
│   │   │   └── VehiclesScreen.tsx     # Tab 2: Veículos
│   │   ├── maintenance/
│   │   │   └── MaintenanceScreen.tsx  # Tab 3: Manutenção
│   │   └── settings/
│   │       └── SettingsScreen.tsx     # Tab 4: Configurações
│   │
│   ├── services/            # Serviços
│   │   ├── api.ts           # Configuração do Axios
│   │   └── authService.ts   # Serviços de autenticação
│   │
│   ├── storage/             # Armazenamento local
│   │   └── authStorage.ts   # AsyncStorage para auth
│   │
│   ├── theme/               # Sistema de design
│   │   ├── index.ts         # Tema principal
│   │   └── tokens.ts        # Tokens semânticos
│   │
│   └── types/               # TypeScript types
│       ├── api.ts           # Tipos da API
│       └── auth.ts          # Tipos de autenticação
│
├── docs/                    # Documentação
│   ├── autenticacao.md      # Doc de autenticação
│   ├── design-system.md     # Doc do sistema de design
│   └── bottom-tabs-navigator.md  # Doc do Bottom Tabs
│
├── App.tsx                  # Componente raiz
├── app.json                 # Configuração Expo
├── package.json             # Dependências
└── tsconfig.json            # Configuração TypeScript
```

## 🧭 Navegação

O aplicativo utiliza **Bottom Tab Navigator** com 4 tabs principais:

### 🏠 Tab 1: Menu
- Menu principal com 4 opções
- Header com avatar e saudação
- Cards de acesso rápido (Veículos, Manutenção, Relatórios, Notificações)

### 🚗 Tab 2: Veículos
- Lista de veículos cadastrados
- Painel de resumo (Total, Ativos, Manutenção)
- Status com badges coloridos
- Botão para adicionar veículo

### 🔧 Tab 3: Manutenção
- Lista de manutenções de veículos
- Painel de resumo (Total, Pendentes, Custo Total)
- Informações detalhadas (Tipo, Descrição, Data, Custo)
- Status com badges (Pendente, Em Andamento, Concluída)
- Botão para adicionar manutenção

### ⚙️ Tab 4: Configurações
- Perfil do usuário
- Configurações de conta
- Preferências do aplicativo
- Suporte e informações
- Logout

📖 **Documentação completa:** [docs/bottom-tabs-navigator.md](docs/bottom-tabs-navigator.md)

## � Instalação

```bash
# Instalar dependências
npm install

# Iniciar o Expo
npm start
```

## 🔐 Autenticação

O aplicativo possui autenticação completa integrada com Laravel Sanctum:

- ✅ Login com email e senha
- ✅ Validação de formulários com Zod
- ✅ Persistência de sessão com AsyncStorage
- ✅ Interceptors Axios para token Bearer
- ✅ Logout com confirmação
- ✅ Restauração automática de sessão

### Credenciais de Teste

```
Email: teste@email.com
Senha: 12345678
```

## 🔌 Integração com Backend

### Configuração da API

O aplicativo se conecta a uma API Laravel em:

```typescript
// src/services/api.ts
baseURL: 'http://192.168.0.190:8000/api'
```

### Endpoints Disponíveis

- `POST /register` - Registrar novo usuário
- `POST /login` - Fazer login
- `GET /me` - Obter usuário autenticado
- `POST /logout` - Fazer logout

### Iniciando o Backend Laravel

```bash
cd d:\projetos_react\facility-car-api
php artisan serve --host=0.0.0.0
```

## 🎨 Componentes Disponíveis

### Button

Botão com 5 variantes e 3 tamanhos:

```tsx
<Button 
  title="Entrar" 
  variant="primary"  // primary | secondary | outline | ghost | danger
  size="md"          // sm | md | lg
  loading={false}
  onPress={() => {}}
/>
```

### Input

Campo de entrada com validação e ícones:

```tsx
<Input
  label="Email"
  placeholder="seu@email.com"
  error="Email inválido"
  helperText="Digite um email válido"
  leftIcon={<Icon />}
  rightIcon={<Icon />}
/>
```

### Card

Container com 3 variantes:

```tsx
<Card 
  variant="elevated"  // default | elevated | outlined
  padding={16}
  onPress={() => {}}  // Opcional
>
  <Text>Conteúdo</Text>
</Card>
```

### Avatar

Avatar com iniciais ou imagem:

```tsx
<Avatar 
  name="João Silva" 
  size="lg"  // sm | md | lg | xl
  backgroundColor={theme.colors.primary[600]}
/>
```

### Badge

Etiqueta de status:

```tsx
<Badge 
  label="Ativo" 
  variant="success"  // success | warning | error | info | neutral
  size="md"          // sm | md | lg
/>
```

### Loading

Tela de carregamento:

```tsx
<Loading 
  message="Carregando..." 
  color={theme.colors.primary[600]} 
/>
```

## 🎨 Usando o Tema

### Importar o Tema

```tsx
import theme from './src/theme';
```

### Usar em Estilos

```tsx
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});
```

## 📚 Documentação

- [Autenticação](docs/autenticacao.md) - Implementação detalhada da autenticação
- [Design System](docs/design-system.md) - Guia completo do sistema de design
- [Bottom Tabs Navigator](docs/bottom-tabs-navigator.md) - Navegação por tabs do app

## 🔄 Fluxo de Autenticação

1. Usuário abre o app
2. App verifica se há token salvo no AsyncStorage
3. Se houver token:
   - Faz requisição para `/me` para validar o token
   - Se válido, mostra tela autenticada (Dashboard)
   - Se inválido, limpa token e mostra tela de login
4. Se não houver token:
   - Mostra tela de login
5. Após login bem-sucedido:
   - Salva token e dados do usuário no AsyncStorage
   - Navega para Dashboard
6. Logout:
   - Chama endpoint `/logout`
   - Remove token e dados do AsyncStorage
   - Navega para tela de login

## 🛠️ Scripts Disponíveis

```bash
# Iniciar Expo
npm start

# Iniciar no Android
npm run android

# Iniciar no iOS
npm run ios

# Iniciar na web
npm run web

# Limpar cache
npm start -- --clear
```

## 📝 Convenções de Código

- **TypeScript** para type safety
- **Functional components** com hooks
- **Named exports** para componentes
- **JSDoc** para documentação
- **Comentários** em português
- **Props interface** para todos os componentes
- **Theme tokens** em vez de valores hardcoded

## 🐛 Troubleshooting

### Erro de conexão com API

Verifique se:
1. O servidor Laravel está rodando: `php artisan serve --host=0.0.0.0`
2. A URL da API está correta em `src/services/api.ts`
3. O dispositivo/emulador está na mesma rede

### AsyncStorage não persiste

Limpe o cache do Expo:
```bash
npm start -- --clear
```

### Erro de validação Zod

Verifique se os campos do formulário correspondem ao schema em `LoginScreen.tsx`

## 📄 Licença

Este projeto é privado e confidencial.

## 👥 Autor

Desenvolvido para controle de motoristas e veículos.

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido seguindo boas práticas de Clean Code e SOLID.
