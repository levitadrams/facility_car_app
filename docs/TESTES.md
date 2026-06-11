# 🧪 Testando a Aplicação

## 📝 Criando Usuário de Teste

Você pode criar um usuário de teste de duas formas:

---

## Opção 1: Via API (Postman/Insomnia)

### Endpoint
```
POST http://SEU_IP:8000/api/register
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Body (JSON)
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "12345678",
  "password_confirmation": "12345678"
}
```

### Resposta Esperada
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "created_at": "2026-06-11T...",
    "updated_at": "2026-06-11T..."
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

## Opção 2: Via Tinker (Laravel)

```bash
cd facility-car
php artisan tinker
```

```php
$user = new \App\Models\User();
$user->name = 'João Silva';
$user->email = 'joao@email.com';
$user->password = bcrypt('12345678');
$user->save();
```

---

## 🔐 Credenciais para Login

Após criar o usuário, use estas credenciais no app:

```
Email: joao@email.com
Senha: 12345678
```

---

## ✅ Fluxo de Teste Completo

### 1. Preparar Backend
```bash
# Terminal 1 - Laravel
cd facility-car
php artisan serve --host=0.0.0.0
```

### 2. Criar Usuário
Use uma das opções acima

### 3. Configurar IP no App
Edite `facility_car_app/src/services/api.ts`
```typescript
const API_BASE_URL = 'http://SEU_IP:8000/api';
```

### 4. Iniciar App
```bash
# Terminal 2 - React Native
cd facility_car_app
npm install  # Primeira vez
npm start
```

### 5. Abrir no Dispositivo
- Escaneie QR code com Expo Go
- Ou pressione `a` (Android) / `i` (iOS)

### 6. Fazer Login
```
Email: joao@email.com
Senha: 12345678
```

### 7. Testar Funcionalidades
- ✅ Login
- ✅ Ver dados no Dashboard
- ✅ Logout
- ✅ Login novamente (sessão persistida)
- ✅ Fechar e abrir app (login automático)

---

## 🧪 Casos de Teste

### Teste 1: Login com Credenciais Válidas
**Passos:**
1. Abrir app
2. Digitar email válido
3. Digitar senha válida
4. Clicar em "Entrar"

**Resultado Esperado:**
- Loading aparece
- Navegação para Dashboard
- Dados do usuário exibidos

---

### Teste 2: Login com Credenciais Inválidas
**Passos:**
1. Abrir app
2. Digitar email válido
3. Digitar senha errada
4. Clicar em "Entrar"

**Resultado Esperado:**
- Loading aparece
- Loading desaparece
- Alert com mensagem "Email ou senha incorretos"
- Permanece na tela de login

---

### Teste 3: Validação de Formulário
**Passos:**
1. Tentar fazer login sem preencher campos
2. Tentar com email inválido
3. Tentar com senha menor que 8 caracteres

**Resultado Esperado:**
- Mensagens de erro abaixo dos campos
- Botão não envia requisição

---

### Teste 4: Persistência de Sessão
**Passos:**
1. Fazer login
2. Fechar app completamente
3. Abrir app novamente

**Resultado Esperado:**
- Tela de loading aparece brevemente
- Usuário já está logado
- Dashboard é exibido automaticamente

---

### Teste 5: Logout
**Passos:**
1. No Dashboard, clicar em "Sair"
2. Confirmar no Alert

**Resultado Esperado:**
- Alert de confirmação aparece
- Após confirmar, retorna para Login
- Dados apagados do AsyncStorage

---

### Teste 6: Logout com Falha na API
**Passos:**
1. Desligar servidor Laravel
2. No Dashboard, clicar em "Sair"
3. Confirmar no Alert

**Resultado Esperado:**
- Mesmo sem API, logout local funciona
- Retorna para Login
- Dados apagados localmente

---

### Teste 7: Token Expirado/Inválido
**Passos:**
1. Fazer login
2. Ir no Laravel e apagar todos tokens:
   ```php
   php artisan tinker
   DB::table('personal_access_tokens')->truncate();
   ```
3. Fechar e abrir app

**Resultado Esperado:**
- App detecta token inválido
- Limpa sessão automaticamente
- Exibe tela de Login

---

## 📊 Checklist de Testes

Antes de considerar completo, teste:

- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Validações de formulário
- [ ] Persistência de sessão (fechar/abrir app)
- [ ] Logout normal
- [ ] Logout com API offline
- [ ] Token inválido (limpeza automática)
- [ ] Navegação fluida
- [ ] Loading states
- [ ] Feedback de erros

---

## 🐛 Erros Comuns e Soluções

### "Email ou senha incorretos"
**Causa**: Credenciais erradas ou usuário não existe

**Solução**: Verifique se criou o usuário corretamente

---

### "Sem conexão com o servidor"
**Causa**: App não consegue acessar Laravel

**Soluções**:
1. Verificar IP em `api.ts`
2. Confirmar Laravel rodando
3. Mesma rede Wi-Fi

---

### "Erro ao fazer login"
**Causa**: Erro genérico da API

**Solução**: 
1. Ver logs do Laravel
2. Verificar se rotas estão configuradas
3. Confirmar que Sanctum está instalado

---

### Loading infinito
**Causa**: Requisição travada

**Soluções**:
1. Reiniciar app
2. Verificar console do Expo para erros
3. Confirmar timeout (30s) em `api.ts`

---

## 💡 Dicas de Teste

### 1. Use o React Native Debugger
```bash
# Instalar
npm install -g react-native-debugger

# No app, shake o dispositivo > Debug
```

### 2. Veja logs do Laravel
```bash
# Terminal 3
cd facility-car
tail -f storage/logs/laravel.log
```

### 3. Use o Expo DevTools
- Pressione `m` no terminal do Expo
- Abre no navegador com logs detalhados

### 4. Limpar Cache
```bash
# Se tiver problemas
cd facility_car_app
npx expo start -c  # Clear cache
```

---

## 📸 Screenshots Esperados

### Tela de Login
- Campo Email
- Campo Senha
- Botão "Entrar"
- Links "Esqueci senha" e "Criar conta"

### Tela de Dashboard
- Nome do usuário
- Email do usuário
- Botão "Sair"

### Tela de Loading
- ActivityIndicator
- Texto "Carregando..."

---

## ✅ Teste Completo = App Funcionando!

Quando todos os testes passarem, seu app está pronto para:
- Desenvolvimento de novas features
- Testes com usuários
- Preparação para produção

**Boa sorte! 🚀**
