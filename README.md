# Driver Control - Aplicativo Mobile

Aplicativo React Native com Expo para controle de manutenção para motoristas de aplicativo.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **AsyncStorage** - Persistência local de dados
- **Context API** - Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Recursos estáticos (imagens, ícones)
├── components/          # Componentes reutilizáveis
│   ├── Button/         # Botão customizado
│   ├── Input/          # Campo de entrada customizado
│   └── Loading/        # Indicador de carregamento
├── contexts/           # Contexts do React
│   └── AuthContext.tsx # Gerenciamento de autenticação
├── hooks/              # Hooks customizados
├── navigation/         # Configuração de rotas
│   ├── AuthRoutes.tsx  # Rotas públicas (não autenticadas)
│   ├── AppRoutes.tsx   # Rotas privadas (autenticadas)
│   └── index.tsx       # Navegação principal
├── screens/            # Telas do aplicativo
│   ├── auth/
│   │   └── LoginScreen.tsx
│   └── dashboard/
│       └── DashboardScreen.tsx
├── services/           # Serviços de API
│   ├── api.ts          # Configuração do Axios
│   └── authService.ts  # Serviços de autenticação
├── storage/            # Persistência local
│   └── authStorage.ts  # Armazenamento de autenticação
├── types/              # Definições TypeScript
│   ├── auth.ts         # Tipos de autenticação
│   └── api.ts          # Tipos de API
├── constants/          # Constantes da aplicação
└── utils/              # Funções utilitárias
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Expo Go (no celular) ou Emulador Android/iOS

### Passos

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o endereço da API:**
   
   Edite o arquivo `src/services/api.ts` e altere a constante `API_BASE_URL` para o endereço do seu servidor Laravel:
   
   ```typescript
   const API_BASE_URL = 'http://SEU_IP:8000/api';
   ```
   
   **Importante:** 
   - Para Android no emulador: use `http://10.0.2.2:8000/api`
   - Para iOS no simulador: use `http://localhost:8000/api`
   - Para dispositivo físico: use o IP da sua máquina na rede local (ex: `http://192.168.1.100:8000/api`)

3. **Inicie o servidor Laravel:**
   ```bash
   cd ../facility-car
   php artisan serve --host=0.0.0.0
   ```

4. **Inicie o aplicativo:**
   ```bash
   npm start
   ```

5. **Execute no dispositivo:**
   - Escaneie o QR code com o Expo Go (Android) ou Camera (iOS)
   - Ou pressione `a` para Android ou `i` para iOS (com emulador)

## 📱 Funcionalidades Implementadas

### ✅ Dia 9 - Estrutura do Projeto
- Criação completa da estrutura de pastas
- Organização escalável e modular

### ✅ Dia 10 - Serviço API
- Configuração do Axios
- Interceptors para autenticação (Bearer Token)
- Tratamento global de erros
- Serviços de autenticação (login, logout, me)

### ✅ Dia 11 - Tela de Login
- Interface moderna e responsiva
- Validação com React Hook Form + Zod
- Feedback visual de erros
- Loading durante autenticação

### ✅ Dia 12 - Integração Laravel
- Integração completa com API Laravel
- Tratamento de erros da API
- Navegação automática após login
- Dashboard funcional

### ✅ Dia 13 - Persistência do Token
- AsyncStorage implementado
- Salvamento automático de token e usuário
- Login automático ao abrir o app
- Validação de token ao iniciar

### ✅ Dia 14 - Logout
- Logout com confirmação
- Revogação de token na API
- Limpeza completa da sessão local
- Tratamento de erros (continua logout local mesmo se API falhar)

## 🎯 Como Usar

### Login
1. Abra o aplicativo
2. Digite email e senha
3. Clique em "Entrar"
4. Será redirecionado para o Dashboard

### Logout
1. No Dashboard, clique em "Sair"
2. Confirme a ação
3. Será redirecionado para a tela de Login

### Credenciais de Teste
Use as credenciais criadas no backend Laravel via `/api/register`

## 🏗️ Arquitetura

### Responsabilidade dos Diretórios

- **components/**: Componentes UI reutilizáveis (Button, Input, Loading)
- **contexts/**: Gerenciamento de estado global com Context API
- **hooks/**: Hooks customizados para lógica reutilizável
- **navigation/**: Configuração de rotas e navegação
- **screens/**: Telas completas do aplicativo
- **services/**: Comunicação com APIs externas
- **storage/**: Persistência local de dados
- **types/**: Definições TypeScript para type safety
- **constants/**: Valores constantes da aplicação
- **utils/**: Funções utilitárias genéricas

### Fluxo de Autenticação

1. **Abertura do App**: AuthContext verifica token no AsyncStorage
2. **Token Válido**: Valida com API e redireciona para Dashboard
3. **Token Inválido/Ausente**: Redireciona para Login
4. **Login**: Envia credenciais → Recebe token → Salva no AsyncStorage → Redireciona para Dashboard
5. **Logout**: Revoga token na API → Limpa AsyncStorage → Redireciona para Login

## 🔐 Segurança

- Tokens armazenados localmente com AsyncStorage
- Interceptor adiciona token automaticamente em todas as requisições
- Validação de token ao iniciar aplicativo
- Limpeza completa de dados ao fazer logout

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o servidor Laravel está rodando
- Confirme o endereço IP correto no `api.ts`
- Certifique-se de que o dispositivo está na mesma rede (Wi-Fi)

### Token inválido
- Faça logout e login novamente
- Limpe os dados do app (configurações do dispositivo)

### Erro de dependências
```bash
npm install
npx expo install --fix
```

## 📝 Próximos Passos

- [ ] Implementar tela de registro
- [ ] Adicionar recuperação de senha
- [ ] Implementar refresh token
- [ ] Adicionar telas de manutenção de veículos
- [ ] Implementar upload de fotos
- [ ] Adicionar notificações push

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido seguindo boas práticas de Clean Code e SOLID.
