# Exemplos de Componentes

Este arquivo contém exemplos práticos de uso dos componentes do sistema de design.

## 📝 Índice

1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [Avatar](#avatar)
5. [Badge](#badge)
6. [Loading](#loading)
7. [Exemplos Completos](#exemplos-completos)

---

## Button

### Exemplo Básico

```tsx
import Button from '@/components/Button';

<Button 
  title="Clique aqui" 
  onPress={() => console.log('Clicado!')} 
/>
```

### Todas as Variantes

```tsx
// Primary (padrão)
<Button title="Primary" variant="primary" />

// Secondary
<Button title="Secondary" variant="secondary" />

// Outline
<Button title="Outline" variant="outline" />

// Ghost
<Button title="Ghost" variant="ghost" />

// Danger
<Button title="Danger" variant="danger" />
```

### Tamanhos

```tsx
// Small
<Button title="Small" size="sm" />

// Medium (padrão)
<Button title="Medium" size="md" />

// Large
<Button title="Large" size="lg" />
```

### Com Loading

```tsx
const [loading, setLoading] = useState(false);

<Button 
  title="Salvar" 
  loading={loading} 
  onPress={async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  }}
/>
```

### Desabilitado

```tsx
<Button 
  title="Desabilitado" 
  disabled 
  onPress={() => {}}
/>
```

---

## Input

### Exemplo Básico

```tsx
import Input from '@/components/Input';

const [email, setEmail] = useState('');

<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
/>
```

### Com Validação

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validateEmail = (value: string) => {
  if (!value) {
    setError('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(value)) {
    setError('Email inválido');
  } else {
    setError('');
  }
};

<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={(value) => {
    setEmail(value);
    validateEmail(value);
  }}
  error={error}
/>
```

### Com Texto Auxiliar

```tsx
<Input
  label="Senha"
  placeholder="Mínimo 8 caracteres"
  helperText="Use letras, números e símbolos"
  secureTextEntry
/>
```

### Com Ícones

```tsx
import { Ionicons } from '@expo/vector-icons';
import theme from '@/theme';

<Input
  label="Email"
  placeholder="seu@email.com"
  leftIcon={
    <Ionicons 
      name="mail-outline" 
      size={20} 
      color={theme.colors.text.tertiary} 
    />
  }
  rightIcon={
    <Ionicons 
      name="checkmark-circle" 
      size={20} 
      color={theme.colors.success[600]} 
    />
  }
/>
```

### Diferentes Tipos

```tsx
// Email
<Input
  label="Email"
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
/>

// Senha
<Input
  label="Senha"
  secureTextEntry
  autoCapitalize="none"
/>

// Telefone
<Input
  label="Telefone"
  keyboardType="phone-pad"
  placeholder="(11) 99999-9999"
/>

// Numérico
<Input
  label="CPF"
  keyboardType="numeric"
  placeholder="000.000.000-00"
/>
```

---

## Card

### Exemplo Básico

```tsx
import Card from '@/components/Card';

<Card>
  <Text>Conteúdo do card</Text>
</Card>
```

### Variantes

```tsx
// Default (sombra média)
<Card variant="default">
  <Text>Card padrão</Text>
</Card>

// Elevated (sombra grande)
<Card variant="elevated">
  <Text>Card elevado</Text>
</Card>

// Outlined (com borda)
<Card variant="outlined">
  <Text>Card com borda</Text>
</Card>
```

### Com Padding Customizado

```tsx
<Card padding={24}>
  <Text>Card com padding maior</Text>
</Card>

<Card padding={8}>
  <Text>Card com padding menor</Text>
</Card>
```

### Card Clicável

```tsx
<Card 
  variant="elevated"
  onPress={() => navigation.navigate('Details')}
>
  <Text>Clique para ver detalhes</Text>
</Card>
```

### Exemplo Complexo

```tsx
<Card variant="elevated">
  <View style={styles.cardHeader}>
    <Avatar name="João Silva" size="md" />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>João Silva</Text>
      <Badge label="Ativo" variant="success" size="sm" />
    </View>
  </View>
  
  <Text style={styles.cardDescription}>
    Motorista profissional com 5 anos de experiência
  </Text>
  
  <Button 
    title="Ver Perfil" 
    variant="outline" 
    size="sm" 
  />
</Card>
```

---

## Avatar

### Exemplo Básico

```tsx
import Avatar from '@/components/Avatar';

<Avatar name="João Silva" />
```

### Tamanhos

```tsx
// Small (32px)
<Avatar name="João Silva" size="sm" />

// Medium (40px - padrão)
<Avatar name="João Silva" size="md" />

// Large (56px)
<Avatar name="João Silva" size="lg" />

// Extra Large (80px)
<Avatar name="João Silva" size="xl" />
```

### Com Imagem

```tsx
<Avatar 
  imageUri="https://i.pravatar.cc/150?img=1" 
  size="lg"
/>
```

### Cores Customizadas

```tsx
import theme from '@/theme';

<Avatar 
  name="Maria Santos"
  backgroundColor={theme.colors.secondary[600]}
  textColor={theme.colors.white}
  size="lg"
/>
```

### Lista de Avatares

```tsx
<View style={styles.avatarList}>
  {users.map((user) => (
    <Avatar 
      key={user.id}
      name={user.name}
      imageUri={user.avatar}
      size="md"
    />
  ))}
</View>

const styles = StyleSheet.create({
  avatarList: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
```

---

## Badge

### Exemplo Básico

```tsx
import Badge from '@/components/Badge';

<Badge label="Novo" />
```

### Variantes

```tsx
// Success (verde)
<Badge label="Aprovado" variant="success" />

// Warning (amarelo)
<Badge label="Pendente" variant="warning" />

// Error (vermelho)
<Badge label="Rejeitado" variant="error" />

// Info (azul)
<Badge label="Em análise" variant="info" />

// Neutral (cinza - padrão)
<Badge label="Inativo" variant="neutral" />
```

### Tamanhos

```tsx
// Small
<Badge label="Tag" variant="info" size="sm" />

// Medium (padrão)
<Badge label="Tag" variant="info" size="md" />

// Large
<Badge label="Tag" variant="info" size="lg" />
```

### Em Lista

```tsx
<View style={styles.badgeList}>
  <Badge label="React Native" variant="info" size="sm" />
  <Badge label="TypeScript" variant="info" size="sm" />
  <Badge label="Expo" variant="info" size="sm" />
</View>

const styles = StyleSheet.create({
  badgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
});
```

---

## Loading

### Exemplo Básico

```tsx
import Loading from '@/components/Loading';

<Loading />
```

### Com Mensagem

```tsx
<Loading message="Carregando dados..." />
```

### Cor Customizada

```tsx
import theme from '@/theme';

<Loading 
  message="Processando..." 
  color={theme.colors.secondary[600]} 
/>
```

### Uso Condicional

```tsx
const [loading, setLoading] = useState(true);

return loading ? (
  <Loading message="Carregando..." />
) : (
  <View>
    {/* Conteúdo da tela */}
  </View>
);
```

---

## Exemplos Completos

### Tela de Perfil

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '@/theme';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card variant="elevated" style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Avatar 
            name="João Silva" 
            size="xl"
            backgroundColor={theme.colors.primary[600]}
          />
        </View>
        
        <Text style={styles.name}>João Silva</Text>
        <Text style={styles.email}>joao.silva@email.com</Text>
        
        <View style={styles.badges}>
          <Badge label="Motorista" variant="info" />
          <Badge label="Verificado" variant="success" />
        </View>
      </Card>

      {/* Info Card */}
      <Card variant="default" style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informações</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>(11) 99999-9999</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CPF</Text>
          <Text style={styles.infoValue}>123.456.789-00</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CNH</Text>
          <Text style={styles.infoValue}>12345678900</Text>
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button 
          title="Editar Perfil" 
          variant="primary" 
        />
        <Button 
          title="Sair" 
          variant="outline" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.layout.containerPadding,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
```

### Formulário de Cadastro

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import theme from '@/theme';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    setLoading(true);
    // Lógica de cadastro
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Card variant="elevated">
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para criar sua conta
        </Text>

        <Input
          label="Nome completo"
          placeholder="João Silva"
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
        />

        <Input
          label="Telefone"
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => setFormData({ ...formData, phone: value })}
          error={errors.phone}
        />

        <Input
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
          helperText="Use letras, números e símbolos"
        />

        <Button
          title="Criar Conta"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Já tenho conta"
          variant="ghost"
          onPress={() => {}}
        />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.layout.containerPadding,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
});
```

### Lista de Itens

```tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import theme from '@/theme';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

const drivers = [
  { id: '1', name: 'João Silva', status: 'Ativo', trips: 150 },
  { id: '2', name: 'Maria Santos', status: 'Ativo', trips: 200 },
  { id: '3', name: 'Pedro Oliveira', status: 'Inativo', trips: 80 },
];

export default function DriversListScreen() {
  const renderItem = ({ item }) => (
    <Card 
      variant="default" 
      onPress={() => {}}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <Avatar name={item.name} size="md" />
        
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.trips}>{item.trips} viagens</Text>
        </View>
        
        <Badge 
          label={item.status} 
          variant={item.status === 'Ativo' ? 'success' : 'neutral'}
          size="sm"
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motoristas</Text>
      
      <FlatList
        data={drivers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.layout.containerPadding,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    marginBottom: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  trips: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
```
