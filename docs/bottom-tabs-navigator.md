# Bottom Tabs Navigator

Documentação do sistema de navegação por tabs do Facility Car App.

## 📱 Estrutura

O aplicativo utiliza **Bottom Tab Navigator** com 4 tabs principais:

### 1. Menu (Tab Principal) 🏠
**Tela:** `MenuScreen.tsx`  
**Ícone:** `home`  
**Cor:** Primary Blue

**Funcionalidades:**
- Cabeçalho com avatar e saudação do usuário
- 4 cards de menu com ícones coloridos:
  - **Meus Veículos** (Azul) - Gerenciar veículos cadastrados
  - **Motoristas** (Verde) - Controle de motoristas
  - **Relatórios** (Laranja) - Ver relatórios e estatísticas
  - **Notificações** (Amarelo) - Central de notificações

**Características:**
- Layout em scroll vertical
- Cards clicáveis com feedback visual
- Ícones coloridos para identificação rápida
- Subtítulos descritivos

---

### 2. Veículos 🚗
**Tela:** `VehiclesScreen.tsx`  
**Ícone:** `car-sport`  
**Cor:** Primary Blue

**Funcionalidades:**
- Header com título e botão de adicionar
- Painel de resumo com 3 métricas:
  - Total de veículos
  - Veículos ativos
  - Veículos em manutenção
- Lista de veículos com:
  - Marca e modelo
  - Placa e ano
  - Badge de status (Ativo, Manutenção, Inativo)

**Status disponíveis:**
- ✅ **Ativo** - Badge verde
- ⚠️ **Manutenção** - Badge amarelo
- ⚫ **Inativo** - Badge cinza

**Dados mockados:**
```typescript
{
  id: '1',
  brand: 'Toyota',
  model: 'Corolla',
  plate: 'ABC-1234',
  year: 2022,
  status: 'active',
}
```

---

### 3. Motoristas 👥
**Tela:** `DriversScreen.tsx`  
**Ícone:** `people`  
**Cor:** Secondary Green

**Funcionalidades:**
- Header com título e botão de adicionar motorista
- Painel de resumo com 3 métricas:
  - Total de motoristas
  - Motoristas ativos
  - Total de viagens
- Lista de motoristas com:
  - Avatar com iniciais
  - Nome e badge de status
  - Email, telefone e número de viagens
  - Ícones indicativos

**Informações exibidas:**
- 📧 Email
- 📞 Telefone
- 🚗 Número de viagens realizadas

**Dados mockados:**
```typescript
{
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-1111',
  trips: 150,
  status: 'active',
}
```

---

### 4. Configurações ⚙️
**Tela:** `SettingsScreen.tsx`  
**Ícone:** `settings`  
**Cor:** Text Tertiary

**Seções:**

#### Perfil do Usuário
- Avatar grande
- Nome e email do usuário logado
- Card elevado com destaque

#### Conta
- **Editar Perfil** - Alterar nome e informações
- **Alterar Senha** - Trocar senha de acesso
- **Privacidade** - Configurações de privacidade

#### Aplicativo
- **Notificações** - Gerenciar notificações
- **Tema** - Claro ou escuro
- **Idioma** - Português (Brasil)

#### Suporte
- **Central de Ajuda** - Documentação e FAQ
- **Sobre** - Versão 1.0.0

#### Ações
- **Sair da Conta** - Botão vermelho com confirmação

---

## 🎨 Customização

### Cores da Tab Bar

```typescript
tabBarActiveTintColor: theme.colors.primary[600],  // Azul quando ativo
tabBarInactiveTintColor: theme.colors.text.tertiary, // Cinza quando inativo
```

### Estilo da Tab Bar

```typescript
tabBarStyle: {
  height: theme.layout.tabBarHeight,      // 60px
  paddingBottom: 8,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: theme.colors.border.light,
  backgroundColor: theme.colors.white,
}
```

### Tamanho dos Ícones

- **Ativo:** 24px
- **Inativo:** 24px
- **Cor:** Dinâmica baseada no estado

---

## 📂 Estrutura de Arquivos

```
src/
├── navigation/
│   ├── TabNavigator.tsx      # Configuração do Bottom Tabs
│   ├── AppRoutes.tsx          # Stack Navigator principal
│   ├── AuthRoutes.tsx         # Rotas de autenticação
│   └── index.tsx              # Routes principal
│
├── screens/
│   ├── menu/
│   │   └── MenuScreen.tsx     # Tab 1: Menu
│   ├── vehicles/
│   │   └── VehiclesScreen.tsx # Tab 2: Veículos
│   ├── drivers/
│   │   └── DriversScreen.tsx  # Tab 3: Motoristas
│   └── settings/
│       └── SettingsScreen.tsx # Tab 4: Configurações
```

---

## 🔄 Navegação

### Entre Tabs

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navegar para outra tab
navigation.navigate('Vehicles');
navigation.navigate('Drivers');
navigation.navigate('Settings');
navigation.navigate('Menu');
```

### Tipos TypeScript

```typescript
export type TabParamList = {
  Menu: undefined;
  Vehicles: undefined;
  Drivers: undefined;
  Settings: undefined;
};
```

---

## 🎯 Como Adicionar uma Nova Tab

1. **Criar a tela:**
```typescript
// src/screens/nova-tab/NovaTabScreen.tsx
export default function NovaTabScreen() {
  return (
    <View>
      <Text>Nova Tab</Text>
    </View>
  );
}
```

2. **Adicionar ao TabNavigator:**
```typescript
import NovaTabScreen from '../screens/nova-tab/NovaTabScreen';

// Adicionar tipo
export type TabParamList = {
  // ... outras tabs
  NovaTab: undefined;
};

// Adicionar Screen
<Tab.Screen 
  name="NovaTab" 
  component={NovaTabScreen}
  options={{
    tabBarLabel: 'Nova',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="star" size={size} color={color} />
    ),
  }}
/>
```

---

## 🎨 Ícones Disponíveis

Todos os ícones são do **Ionicons** (@expo/vector-icons):

- `home` - Casa/Menu
- `car-sport` - Veículo
- `people` - Pessoas/Grupo
- `settings` - Configurações
- `notifications` - Notificações
- `document-text` - Documentos
- `stats-chart` - Estatísticas
- `person` - Pessoa
- `add-circle` - Adicionar
- E muitos mais...

📖 Ver todos em: https://icons.expo.fyi/Index

---

## 🔐 Segurança

- Todas as tabs estão protegidas por autenticação
- Apenas usuários logados têm acesso
- Token verificado ao iniciar o app
- Logout remove acesso a todas as tabs

---

## 📱 Responsividade

- Tab bar adaptável ao tamanho da tela
- Componentes responsivos em todas as telas
- Scroll automático em listas longas
- Safe area respeitada

---

## 🧪 Dados de Teste

### Veículos Mockados
- Toyota Corolla 2022 - ABC-1234 (Ativo)
- Honda Civic 2021 - DEF-5678 (Ativo)
- Volkswagen Polo 2020 - GHI-9012 (Manutenção)
- Fiat Argo 2023 - JKL-3456 (Ativo)

### Motoristas Mockados
- João Silva - 150 viagens (Ativo)
- Maria Santos - 200 viagens (Ativo)
- Pedro Oliveira - 80 viagens (Inativo)
- Ana Costa - 175 viagens (Ativo)

---

## 🔄 Próximos Passos

- [ ] Integrar com API real
- [ ] Adicionar filtros nas listas
- [ ] Implementar busca
- [ ] Adicionar paginação
- [ ] Criar telas de detalhes
- [ ] Implementar formulários de cadastro
- [ ] Adicionar notificações em tempo real
- [ ] Implementar tema escuro

---

## 📝 Exemplos de Uso

### Acessar Dados do Usuário

```typescript
import { useAuth } from '../../contexts/AuthContext';

const { user } = useAuth();

<Text>{user?.name}</Text>
<Text>{user?.email}</Text>
```

### Navegar Entre Telas

```typescript
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '../../navigation/TabNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProp = BottomTabNavigationProp<TabParamList>;

const navigation = useNavigation<NavigationProp>();

// Navegar para veículos
navigation.navigate('Vehicles');
```

### Usar Componentes do Design System

```typescript
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import theme from '../../theme';

<Card variant="elevated">
  <Avatar name="João Silva" size="lg" />
  <Badge label="Ativo" variant="success" />
</Card>
```
