# 📁 Pasta `config/` — Central de Configurações

Inspirada na pasta `config/` do Laravel, esta pasta centraliza todas as constantes e parâmetros do aplicativo, permitindo alterar comportamentos sem tocar na lógica de negócio.

---

## 🗂️ Estrutura

```
src/
  config/
    index.ts          ← Exporta todas as configs (ponto único de importação)
    auth.ts           ← Configurações de autenticação
    api.ts            ← Configurações da API
    app.ts            ← Configurações gerais do app (opcional)
```

---

## 📦 Como Usar

### Importação Individual (recomendado para Tree Shaking)

```typescript
import { authConfig } from '@/config/auth';

const timeout = authConfig.inactivityTimeout; // 1800000 (30 min em ms)
```

### Importação Centralizada

```typescript
import { authConfig, apiConfig } from '@/config';

console.log(authConfig.inactivityTimeout);
console.log(apiConfig.baseURL);
```

---

## ⚙️ Arquivos Existentes

### `auth.ts`
Centraliza tudo relacionado à sessão do usuário:

| Constante | Valor | Descrição |
|-----------|-------|-----------|
| `authConfig.inactivityTimeout` | `30 * 60 * 1000` | Tempo máximo em background antes do logout |
| `authConfig.tokenCacheDuration` | `5 * 60 * 1000` | Tempo de cache do token |
| `authConfig.maxLoginAttempts` | `5` | Tentativas antes do bloqueio |
| `authConfig.lockoutDuration` | `15 * 60 * 1000` | Tempo de bloqueio |
| `authStorageKeys.token` | `'@facilitycar:token'` | Chave do SecureStore |

### `api.ts`
Configurações de comunicação com o backend:

| Constante | Valor | Descrição |
|-----------|-------|-----------|
| `apiConfig.baseURL` | `process.env.EXPO_PUBLIC_API_URL` | URL base da API |
| `apiConfig.timeout` | `15000` | Timeout padrão (ms) |
| `apiConfig.uploadTimeout` | `60000` | Timeout de upload (ms) |

---

## 🔄 Comparativo: Antes vs Depois

### ❌ Antes (hardcoded no AuthContext)
```typescript
// AuthContext.tsx — espalhado e difícil de ajustar
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
```

### ✅ Depois (centralizado em `config/`)
```typescript
// AuthContext.tsx — limpo e reutilizável
import { authConfig } from '../config/auth';

const INACTIVITY_TIMEOUT = authConfig.inactivityTimeout;
```

---

## 🎯 Vantagens

1. **Single Source of Truth** — um único lugar para alterar valores
2. **Facilidade de manutenção** — não precisa caçar no código
3. **Reutilização** — mesma constante usada em múltiplos lugares
4. **Testes** — mockar configs em testes é trivial
5. **Code Review** — alterações de comportamento ficam visíveis

---

## 🚀 Criando Novo Arquivo de Config

1. Crie o arquivo:
   ```bash
   touch src/config/maps.ts
   ```

2. Defina as constantes:
   ```typescript
   export const mapsConfig = {
     defaultRegion: { latitude: -23.55, longitude: -46.63 },
     defaultZoom: 12,
   } as const;
   ```

3. Exporte no `index.ts`:
   ```typescript
   export { mapsConfig } from './maps';
   ```

4. Use no código:
   ```typescript
   import { mapsConfig } from '@/config';
   ```

---

## 💡 Dica: TypeScript `as const`

Sempre use `as const` no final do objeto. Isso:
- Torna as propriedades `readonly`
- Preserva os valores literais como tipos (ex: `30 * 60 * 1000` vira `1800000`, não `number`)
- Permite autocomplete inteligente no IDE
