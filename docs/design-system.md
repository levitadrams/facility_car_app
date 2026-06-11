# Sistema de Design - Facility Car App

## 📚 Visão Geral

Este documento descreve o sistema de design do aplicativo Facility Car, incluindo paleta de cores, espaçamento, tipografia e componentes reutilizáveis.

## 🎨 Paleta de Cores

### Cores Primárias

- **Primary (Azul)**: `#2563EB` (600) - Cor principal do aplicativo
- **Secondary (Verde)**: `#059669` (600) - Cor secundária
- **Accent (Laranja)**: `#EA580C` (600) - Cor de destaque

### Cores de Status

- **Success**: `#16A34A` (600) - Sucesso
- **Warning**: `#CA8A04` (600) - Aviso
- **Error/Danger**: `#DC2626` (600) - Erro
- **Info**: `#0891B2` (600) - Informação

### Cores Neutras

- **Gray**: Escala de 50 a 900
- **White**: `#FFFFFF`
- **Black**: `#000000`
- **Transparent**: `transparent`

### Cores Semânticas

```typescript
colors: {
  background: {
    primary: '#FFFFFF',      // Fundo principal
    secondary: '#F9FAFB',    // Fundo secundário
    tertiary: '#F3F4F6',     // Fundo terciário
  },
  text: {
    primary: '#111827',      // Texto principal
    secondary: '#6B7280',    // Texto secundário
    tertiary: '#9CA3AF',     // Texto terciário
    disabled: '#D1D5DB',     // Texto desabilitado
  },
  border: {
    light: '#E5E7EB',        // Borda clara
    medium: '#D1D5DB',       // Borda média
    dark: '#9CA3AF',         // Borda escura
  }
}
```

## 📏 Espaçamento

Sistema baseado em múltiplos de 4:

```typescript
spacing: {
  xxs: 2,    // Extra extra small
  xs: 4,     // Extra small
  sm: 8,     // Small
  md: 16,    // Medium
  lg: 24,    // Large
  xl: 32,    // Extra large
  xxl: 40,   // Extra extra large
  xxxl: 64,  // Extra extra extra large
}
```

## ✍️ Tipografia

### Tamanhos de Fonte

```typescript
fontSize: {
  xs: 12,    // Extra small
  sm: 14,    // Small
  md: 16,    // Medium (base)
  lg: 18,    // Large
  xl: 20,    // Extra large
  xxl: 24,   // Extra extra large
  xxxl: 32,  // Extra extra extra large
  xxxxl: 40, // Display
}
```

### Pesos de Fonte

```typescript
fontWeight: {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

### Alturas de Linha

```typescript
lineHeight: {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
}
```

## 🔘 Componentes

### Button

Componente de botão com variantes e tamanhos.

**Variantes:**
- `primary` - Botão primário (azul)
- `secondary` - Botão secundário (verde)
- `outline` - Botão com borda
- `ghost` - Botão transparente
- `danger` - Botão de perigo (vermelho)

**Tamanhos:**
- `sm` - 40px de altura
- `md` - 48px de altura (padrão)
- `lg` - 56px de altura

**Exemplo:**
```tsx
<Button 
  title="Entrar" 
  variant="primary" 
  size="md"
  loading={false}
  onPress={() => {}}
/>
```

### Input

Componente de entrada de texto com suporte a labels, erros e ícones.

**Estados:**
- Default - Estado padrão
- Focused - Quando focado
- Error - Com erro de validação
- Disabled - Desabilitado

**Exemplo:**
```tsx
<Input
  label="Email"
  placeholder="seu@email.com"
  error="Email inválido"
  helperText="Digite seu email"
  leftIcon={<Icon name="mail" />}
  rightIcon={<Icon name="check" />}
/>
```

### Card

Container com estilização consistente.

**Variantes:**
- `default` - Card padrão com sombra média
- `elevated` - Card com sombra grande
- `outlined` - Card com borda sem sombra

**Exemplo:**
```tsx
<Card variant="elevated" padding={16}>
  <Text>Conteúdo do card</Text>
</Card>
```

### Avatar

Exibição de iniciais ou imagens de perfil.

**Tamanhos:**
- `sm` - 32x32px
- `md` - 40x40px (padrão)
- `lg` - 56x56px
- `xl` - 80x80px

**Exemplo:**
```tsx
<Avatar 
  name="João Silva" 
  size="lg"
  backgroundColor={theme.colors.primary[600]}
/>

<Avatar 
  imageUri="https://example.com/avatar.jpg" 
  size="md"
/>
```

### Badge

Etiquetas de status e categorias.

**Variantes:**
- `success` - Verde
- `warning` - Amarelo
- `error` - Vermelho
- `info` - Azul
- `neutral` - Cinza

**Tamanhos:**
- `sm` - Pequeno
- `md` - Médio (padrão)
- `lg` - Grande

**Exemplo:**
```tsx
<Badge label="Ativo" variant="success" size="md" />
```

### Loading

Indicador de carregamento em tela cheia.

**Exemplo:**
```tsx
<Loading message="Carregando..." color={theme.colors.primary[600]} />
```

## 🎯 Border Radius

```typescript
borderRadius: {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999, // Circular
}
```

## 🌑 Sombras

```typescript
shadows: {
  none: { elevation: 0 },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: { elevation: 3 },
  lg: { elevation: 6 },
  xl: { elevation: 12 },
}
```

## 📱 Layout

```typescript
layout: {
  containerPadding: 24,     // Padding padrão dos containers
  cardPadding: 16,          // Padding padrão dos cards
  buttonHeight: 48,         // Altura padrão dos botões
  inputHeight: 50,          // Altura padrão dos inputs
  headerHeight: 56,         // Altura do header
  tabBarHeight: 60,         // Altura da tab bar
}
```

## 🔍 Opacidade

```typescript
opacity: {
  disabled: 0.6,    // Elementos desabilitados
  hover: 0.7,       // Estado hover/pressed
  overlay: 0.4,     // Overlays
}
```

## 🎨 Como Usar

### Importando o Tema

```typescript
import theme from '../../theme';
```

### Usando em Estilos

```typescript
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

### Usando Tokens Semânticos

```typescript
import { buttonVariants, inputStates, cardStyles } from '../../theme/tokens';

// Variantes de botões
const primaryButton = buttonVariants.primary;

// Estados de input
const focusedInput = inputStates.focused;

// Estilos de card
const elevatedCard = cardStyles.elevated;
```

## 📝 Boas Práticas

1. **Sempre use valores do tema** em vez de valores hardcoded
2. **Use cores semânticas** (`text.primary`, `background.secondary`) em vez de cores diretas
3. **Mantenha consistência** ao aplicar espaçamentos e tipografia
4. **Use componentes reutilizáveis** quando possível
5. **Evite criar novos componentes** se os existentes atendem à necessidade
6. **Documente variações** de componentes quando necessário

## 🔄 Atualizações

Para atualizar o tema, edite os arquivos:
- `src/theme/index.ts` - Definições principais do tema
- `src/theme/tokens.ts` - Tokens semânticos e variantes

## 🎓 Exemplos de Uso

### Tela com Tema Completo

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

export default function ExampleScreen() {
  return (
    <View style={styles.container}>
      <Card variant="elevated">
        <Avatar name="João Silva" size="lg" />
        <Text style={styles.title}>Título</Text>
        <Text style={styles.subtitle}>Subtítulo</Text>
        <Button title="Ação" variant="primary" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.layout.containerPadding,
    backgroundColor: theme.colors.background.secondary,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
});
```
