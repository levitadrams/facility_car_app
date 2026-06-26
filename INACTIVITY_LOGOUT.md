# 🔒 Sistema de Logout por Inatividade

## 📋 Visão Geral

Sistema implementado no `AuthContext` que monitora automaticamente quando o aplicativo vai para segundo plano e desloga o usuário se ele ficar inativo por mais de 30 minutos.

## ⚙️ Como Funciona

### 1. **Monitoramento do AppState**
- Utiliza `AppState.addEventListener` do React Native
- Detecta quando o app muda de estado (`active`, `background`, `inactive`)

### 2. **Registro de Timestamp**
- Quando o app vai para segundo plano → registra `Date.now()`
- Armazena em `useRef` para persistir entre re-renders

### 3. **Verificação ao Retornar**
- Quando o app volta para primeiro plano → calcula tempo decorrido
- Compara com limite de 30 minutos (configurável)

### 4. **Ação Automática**
- **< 30 min**: Usuário continua logado normalmente
- **> 30 min**: Exibe alerta e desloga automaticamente

## 🎯 Benefícios para Motoristas

### ✅ Cenários que NÃO deslogam:
- Aceitar corrida em outro app (Uber/99)
- Responder mensagem rápida
- Atender ligação
- Consultar GPS/Waze
- Pausas curtas para café/banheiro

### ⚠️ Cenários que deslogam:
- Terminar turno e esquecer app aberto
- Deixar celular guardado por horas
- Fim de expediente prolongado

## 🔧 Configuração

### Ajustar Tempo Limite

No arquivo `AuthContext.tsx`, linha 29:

```typescript
// Padrão: 30 minutos
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Exemplos de outros valores:
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas
```

## 🛡️ Segurança

### Proteção de Dados
- ✅ Limpa `SecureStore` automaticamente no logout
- ✅ Remove token da API
- ✅ Limpa estado do contexto

### Prevenção de Memory Leaks
- ✅ Remove listener do `AppState` no cleanup do `useEffect`
- ✅ Usa `useRef` para evitar re-renders desnecessários
- ✅ Só monitora quando usuário está autenticado

## 📊 Logs de Debug

O sistema registra logs no console para facilitar debug:

```
App foi para segundo plano: 14:30:45
App voltou ao primeiro plano. Tempo inativo: 5 minutos
Tempo de inatividade dentro do limite. Usuário continua logado.
```

```
App foi para segundo plano: 14:00:00
App voltou ao primeiro plano. Tempo inativo: 35 minutos
Tempo de inatividade excedido. Deslogando usuário...
```

## 🧪 Como Testar

### Teste 1: Inatividade Curta (< 30 min)
1. Faça login no app
2. Minimize o app (botão Home)
3. Aguarde 5 minutos
4. Abra o app novamente
5. ✅ **Resultado esperado**: Continua logado

### Teste 2: Inatividade Longa (> 30 min)
1. Faça login no app
2. Minimize o app
3. Aguarde 31+ minutos (ou ajuste o timeout para 1 minuto para testar)
4. Abra o app novamente
5. ✅ **Resultado esperado**: Alerta de sessão expirada + logout automático

### Teste 3: Múltiplas Alternâncias
1. Faça login
2. Minimize por 10 minutos
3. Abra por 2 minutos
4. Minimize por mais 10 minutos
5. Abra novamente
6. ✅ **Resultado esperado**: Continua logado (contador reseta a cada retorno)

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuário Autenticado                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  App em Primeiro Plano  │
              │      (state: active)     │
              └─────────────────────────┘
                            │
                            │ Usuário minimiza app
                            ▼
              ┌─────────────────────────┐
              │  App em Segundo Plano   │
              │  (state: background)     │
              │  ⏰ Registra timestamp   │
              └─────────────────────────┘
                            │
                            │ Usuário abre app
                            ▼
              ┌─────────────────────────┐
              │  Calcula tempo inativo  │
              └─────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         < 30 minutos            > 30 minutos
                │                       │
                ▼                       ▼
    ┌───────────────────┐   ┌──────────────────┐
    │ Continua Logado   │   │  Exibe Alerta    │
    │ ✅ Sem ação       │   │  🔒 Desloga      │
    └───────────────────┘   └──────────────────┘
```

## 📝 Notas Importantes

1. **Não afeta uso ativo**: O timer só conta quando o app está em segundo plano
2. **Reseta a cada retorno**: Cada vez que o usuário volta ao app, o contador é zerado
3. **Só monitora usuários logados**: Se não há usuário autenticado, o listener não é ativado
4. **Cleanup automático**: Listeners são removidos quando o componente desmonta ou usuário desloga

## 🎨 Personalização do Alerta

Para customizar a mensagem do alerta, edite a função `checkInactivityTimeout()`:

```typescript
Alert.alert(
  'Título Personalizado',
  'Mensagem personalizada aqui',
  [
    {
      text: 'Entendi',
      onPress: async () => {
        await signOut();
      },
    },
  ],
  { cancelable: false }
);
```

## 🚀 Melhorias Futuras (Opcionais)

1. **Configuração por perfil**: Diferentes timeouts para diferentes tipos de usuário
2. **Aviso prévio**: Notificar usuário 5 minutos antes do logout
3. **Persistir timestamp**: Salvar no AsyncStorage para sobreviver a crashes
4. **Analytics**: Registrar eventos de logout por inatividade
5. **Modo "Não perturbe"**: Permitir usuário desabilitar temporariamente
