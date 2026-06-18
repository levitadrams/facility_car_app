# ⚙️ Configuração Rápida da API

## 📍 IMPORTANTE: Configure o endereço da API antes de executar!

### Arquivo a Editar

📁 `src/services/api.ts`

### Localização da Configuração

```typescript
// Linha ~10
const API_BASE_URL = 'http://192.168.1.100:8000/api';
```

---

## 🔧 Configurações por Cenário

### 1️⃣ Emulador Android

```typescript
const API_BASE_URL = 'http://10.0.2.2:8000/api';
```

**Por quê?**
- `10.0.2.2` é o IP especial do Android que aponta para `localhost` do computador host

---

### 2️⃣ Simulador iOS

```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

**Por quê?**
- iOS Simulator compartilha a rede com o Mac host
- `localhost` funciona diretamente

---

### 3️⃣ Dispositivo Físico (Recomendado para Testes)

```typescript
const API_BASE_URL = 'http://192.168.1.100:8000/api';
```

**⚠️ IMPORTANTE:**
- Substitua `192.168.1.100` pelo **IP real da sua máquina**
- Dispositivo e computador devem estar na **mesma rede Wi-Fi**

---

## 🔍 Como Descobrir o IP da sua Máquina

### Windows
```powershell
ipconfig
```
Procure por: `Endereço IPv4` na seção da sua rede Wi-Fi

### Linux/Mac
```bash
ifconfig
```
ou
```bash
ip addr show
```

Procure pelo IP que começa com `192.168.x.x` ou `10.0.x.x`

---

## 🚀 Iniciando o Servidor Laravel

**⚠️ CRUCIAL: O servidor precisa aceitar conexões externas!**

### Comando Correto
```bash
cd facility-car-api
php artisan serve --host=0.0.0.0
```

### ❌ Errado (não funciona com dispositivo físico)
```bash
php artisan serve  # Aceita apenas conexões de localhost
```

---

## ✅ Checklist de Configuração

Antes de executar o app, verifique:

- [ ] IP configurado corretamente em `src/services/api.ts`
- [ ] Laravel rodando com `--host=0.0.0.0`
- [ ] Dispositivo e computador na mesma rede Wi-Fi
- [ ] Firewall não está bloqueando porta 8000
- [ ] AsyncStorage instalado (`npm install`)

---

## 🔥 Teste Rápido

Depois de configurar, teste se a API está acessível:

### No navegador do celular
Acesse: `http://SEU_IP:8000`

Deve mostrar a página inicial do Laravel.

---

## 🐛 Problemas Comuns

### Erro: "Network Request Failed"
**Causa**: App não consegue se conectar com a API

**Soluções**:
1. Verifique se o IP está correto
2. Confirme que Laravel está rodando
3. Certifique-se que ambos estão na mesma rede
4. Desabilite firewall temporariamente para testar

### Erro: "Timeout of 30000ms exceeded"
**Causa**: Laravel não respondeu a tempo

**Soluções**:
1. Verifique se o servidor Laravel está realmente rodando
2. Confirme que usou `--host=0.0.0.0`
3. Tente reiniciar o servidor Laravel

### Erro 404 em /api/login
**Causa**: Rotas da API não estão configuradas

**Soluções**:
1. Verifique se `routes/api.php` existe no Laravel
2. Confirme que `bootstrap/app.php` está configurado para usar rotas de API
3. Execute `php artisan route:list` para ver as rotas

---

## 📱 Exemplo Completo de Configuração

### Cenário: Testando em celular Android físico

**1. Descobrir IP da máquina (Windows):**
```powershell
ipconfig
# Resultado: 192.168.0.105
```

**2. Editar `src/services/api.ts`:**
```typescript
const API_BASE_URL = 'http://192.168.0.105:8000/api';
```

**3. Iniciar Laravel:**
```bash
cd facility-car-api
php artisan serve --host=0.0.0.0
# Laravel development server started: http://0.0.0.0:8000
```

**4. Testar conexão no navegador do celular:**
```
http://192.168.0.105:8000
```

**5. Iniciar app Expo:**
```bash
cd facility_car_app
npm start
# Escanear QR code com Expo Go
```

**6. Fazer login no app!** 🎉

---

## 💡 Dica de Produção

Para produção, use variáveis de ambiente:

```typescript
// .env
API_URL=https://api.seudominio.com

// api.ts
const API_BASE_URL = process.env.API_URL || 'http://localhost:8000/api';
```

---

## 📚 Links Úteis

- [Expo Network Debugging](https://docs.expo.dev/guides/troubleshooting-proxies/)
- [Laravel Serving](https://laravel.com/docs/12.x/installation#local-development-server)
- [React Native Networking](https://reactnative.dev/docs/network)

---

**✨ Configuração correta = App funcionando perfeitamente!**
