# AdoraScale - Progressive Web App (PWA)

## 📱 Sobre a Aplicação PWA

AdoraScale é um aplicativo Progressive Web App (PWA) que pode ser instalado em qualquer dispositivo (desktop, tablet ou mobile) como um aplicativo nativo, sem necessidade de downloads da loja de aplicativos.

## ✨ Recursos PWA Disponíveis

### ✅ Implementados
- **Modo Standalone**: Executa como aplicativo independente (sem barra de endereço do navegador)
- **Ícone na Tela Inicial**: Instale um ícone no desktop/home screen
- **Splash Screen**: Tela de carregamento customizada
- **Trabalha Offline**: Funciona completamente offline graças ao Service Worker
- **Sincronização de Dados**: Todos os dados são salvos localmente no dispositivo
- **Install Prompt**: Aviso de instalação automático em navegadores compatíveis

## 🚀 Como Instalar em Diferentes Plataformas

### 🍎 iPhone/iPad (iOS)
1. Abra o aplicativo Safari
2. Navegue até: **https://seu-dominio.com/escala-louvor** (ou localhost em desenvolvimento)
3. Toque no botão **Compartilhar** (ícone da seta saindo de uma caixa)
4. Selecione **Adicionar à Tela Inicial**
5. Escolha um nome e toque em **Adicionar**
6. O aplicativo aparecerá na sua tela inicial

### 🤖 Android
1. Abra o navegador Chrome ou Edge
2. Navegue até: **https://seu-dominio.com/escala-louvor**
3. Um banner de "Instalar" aparecerá na parte inferior (ou toque no ⋮ menu)
4. Toque em **Instalar aplicativo**
5. Confirme a instalação
6. O aplicativo aparecerá na sua tela inicial

### 💻 Windows/Mac (Desktop)
1. Abra Chrome, Edge ou outro navegador compatível
2. Navegue até: **https://seu-dominio.com/escala-louvor**
3. Clique no ícone de instalação (canto superior direito da barra de endereço)
4. Ou toque no ⋮ menu > **Instalar aplicativo**
5. Confirme a instalação
6. O aplicativo será criado como atalho na Área de Trabalho

## 📋 Requisitos do Sistema

### Para Desenvolvimento Local
- Node.js ou Python (para servir localmente com HTTPS)
- Navegador moderno (Chrome, Edge, Safari, Firefox)

### Para Produção
- Servidor HTTPS (obrigatório para PWA)
- Domínio válido
- Certificado SSL/TLS

## 🔧 Configuração e Deployment

### 1. **Desenvolvimento Local com HTTPS**

#### Usando Python 3:
```bash
# Na pasta do projeto
python -m http.server --cgi 8000
```

Para HTTPS, use:
```bash
# Instale mkcert primeiro
python -m pip install mkcert
mkcert localhost 127.0.0.1 ::1

# Inicie servidor HTTPS
python -m http.server --cgi 8443 --certfile=localhost+1.pem --keyfile=localhost+1-key.pem
```

#### Usando Node.js:
```bash
npm install -g http-server
http-server -p 8080 -c-1 --gzip
```

Para HTTPS com Node:
```bash
npm install -g local-web-server
lws --https --spa index.html
```

### 2. **Deploy em Servidor Web**

#### Requisitos:
- ✅ HTTPS habilitado (certificado SSL válido)
- ✅ CORS configurado corretamente (se necessário)
- ✅ Service Worker registrado (arquivo `sw.js`)
- ✅ Manifest.json acessível
- ✅ Ícones nos tamanhos corretos (192x192 e 512x512)

#### Pastas Necessárias:
```
/escala-louvor/
├── index.html
├── app.js
├── styles.css
├── sw.js
├── manifest.json
├── icon-192.jpg
├── icon-512.jpg
└── (outros arquivos)
```

### 3. **Hosts Populares para Deploy**

#### **Netlify** (Recomendado - Fácil)
```bash
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir .

# Acesso automático via HTTPS
```

#### **Vercel** (Excelente para PWA)
```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

#### **GitHub Pages** + CloudFlare
1. Faça push do código para GitHub
2. Configure GitHub Pages em Settings
3. Use CloudFlare como CDN (com HTTPS)

#### **Servidor Apache/Nginx Próprio**
```nginx
# nginx.conf example
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json text/css application/javascript;
    
    # Cache settings
    add_header Cache-Control "public, max-age=3600";
    
    # Service Worker - sem cache
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Manifest - sem cache
    location = /manifest.json {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    root /var/www/html/escala-louvor;
    index index.html;
    
    # SPA fallback
    try_files $uri $uri/ /index.html;
}
```

## 📦 Arquivo de Configuração

### manifest.json
Contém metadados da aplicação:
- Nome e ícone da aplicação
- Cores do tema
- Modo de exibição (standalone)
- Atalhos da tela inicial
- Categorias

### sw.js (Service Worker)
Gerencia:
- Cache de arquivos estáticos
- Funcionamento offline
- Sincronização de dados
- Atualizações do aplicativo

## 🔐 Segurança

### Boas Práticas Implementadas:
- ✅ localStorage para dados sensíveis do usuário
- ✅ Validação de entrada em todos os formulários
- ✅ Sem armazenamento de senhas (apenas verificação em tempo de execução)
- ✅ Dados isolados por usuário (sessionStorage)

### Recomendações Adicionais:
- 🔒 Use HTTPS em produção (obrigatório)
- 🔑 Considere adicionar autenticação via OAuth
- 🛡️ Implemente CORS corretamente
- 📊 Monitore o uso do localStorage
- 🔄 Atualize o certificado SSL regularmente

## 📊 Monitoramento

### Verificar Instalação do Service Worker:
1. Abra DevTools (F12)
2. Vá para **Application** → **Service Workers**
3. Confirme que `sw.js` está **registered e running**

### Verificar Cache:
1. DevTools → **Application** → **Storage** → **Cache Storage**
2. Procure por `adorascale-cache-v1`
3. Verifique quais arquivos estão em cache

### Verificar Manifest:
1. DevTools → **Application** → **Manifest**
2. Confirme que nome, ícones e cores aparecem corretamente

## 🐛 Solução de Problemas

### Problema: Service Worker não registra
- ✓ Confirme HTTPS ativado
- ✓ Verifique console (F12) para erros
- ✓ Limpe cache do navegador
- ✓ Recarregue a página

### Problema: Ícone não aparece na instalação
- ✓ Confirme que icon-192.jpg e icon-512.jpg existem
- ✓ Verifique tamanho exato (192x192 e 512x512 pixels)
- ✓ Limpe o cache do navegador
- ✓ Aguarde ~5 minutos para atualização

### Problema: Aplicativo não funciona offline
- ✓ Verifique se Service Worker está ativo
- ✓ Confirme arquivo `sw.js` é acessível
- ✓ Verifique console para erros de cache

### Problema: Dados não sincronizam entre dispositivos
- ✓ Isso é comportamento esperado (dados locais no dispositivo)
- ✓ Para sincronização, implemente backend com database

## 📱 Teste em Diferentes Dispositivos

Recomendamos testar em:
- ✅ Chrome/Edge Desktop
- ✅ Chrome Android
- ✅ Safari iPhone/iPad
- ✅ Samsung Internet (Android)
- ✅ Firefox (suporte limitado)

## 🚀 Próximas Melhorias Sugeridas

1. **Backend Sync**: Sincronizar escalas entre dispositivos
2. **Push Notifications**: Notificações de novas escalas
3. **Offline-First Database**: IndexedDB ao invés de localStorage
4. **Dark Mode Toggle**: Alternância de tema
5. **Export/Import**: Backup e restauração de dados
6. **Analytics**: Rastrear uso do aplicativo

## 📞 Suporte

Para problemas com PWA:
- Consulte [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- Verifique [Lighthouse Report](https://developers.google.com/web/tools/lighthouse) para otimizações
- Teste em [PWA Builder](https://www.pwabuilder.com)

---

**AdoraScale PWA** - Pronto para instalar e usar offline! 🎵
=======
# AdoraScale - Progressive Web App (PWA)

## 📱 Sobre a Aplicação PWA

AdoraScale é um aplicativo Progressive Web App (PWA) que pode ser instalado em qualquer dispositivo (desktop, tablet ou mobile) como um aplicativo nativo, sem necessidade de downloads da loja de aplicativos.

## ✨ Recursos PWA Disponíveis

### ✅ Implementados
- **Modo Standalone**: Executa como aplicativo independente (sem barra de endereço do navegador)
- **Ícone na Tela Inicial**: Instale um ícone no desktop/home screen
- **Splash Screen**: Tela de carregamento customizada
- **Trabalha Offline**: Funciona completamente offline graças ao Service Worker
- **Sincronização de Dados**: Todos os dados são salvos localmente no dispositivo
- **Install Prompt**: Aviso de instalação automático em navegadores compatíveis

## 🚀 Como Instalar em Diferentes Plataformas

### 🍎 iPhone/iPad (iOS)
1. Abra o aplicativo Safari
2. Navegue até: **https://seu-dominio.com/escala-louvor** (ou localhost em desenvolvimento)
3. Toque no botão **Compartilhar** (ícone da seta saindo de uma caixa)
4. Selecione **Adicionar à Tela Inicial**
5. Escolha um nome e toque em **Adicionar**
6. O aplicativo aparecerá na sua tela inicial

### 🤖 Android
1. Abra o navegador Chrome ou Edge
2. Navegue até: **https://seu-dominio.com/escala-louvor**
3. Um banner de "Instalar" aparecerá na parte inferior (ou toque no ⋮ menu)
4. Toque em **Instalar aplicativo**
5. Confirme a instalação
6. O aplicativo aparecerá na sua tela inicial

### 💻 Windows/Mac (Desktop)
1. Abra Chrome, Edge ou outro navegador compatível
2. Navegue até: **https://seu-dominio.com/escala-louvor**
3. Clique no ícone de instalação (canto superior direito da barra de endereço)
4. Ou toque no ⋮ menu > **Instalar aplicativo**
5. Confirme a instalação
6. O aplicativo será criado como atalho na Área de Trabalho

## 📋 Requisitos do Sistema

### Para Desenvolvimento Local
- Node.js ou Python (para servir localmente com HTTPS)
- Navegador moderno (Chrome, Edge, Safari, Firefox)

### Para Produção
- Servidor HTTPS (obrigatório para PWA)
- Domínio válido
- Certificado SSL/TLS

## 🔧 Configuração e Deployment

### 1. **Desenvolvimento Local com HTTPS**

#### Usando Python 3:
```bash
# Na pasta do projeto
python -m http.server --cgi 8000
```

Para HTTPS, use:
```bash
# Instale mkcert primeiro
python -m pip install mkcert
mkcert localhost 127.0.0.1 ::1

# Inicie servidor HTTPS
python -m http.server --cgi 8443 --certfile=localhost+1.pem --keyfile=localhost+1-key.pem
```

#### Usando Node.js:
```bash
npm install -g http-server
http-server -p 8080 -c-1 --gzip
```

Para HTTPS com Node:
```bash
npm install -g local-web-server
lws --https --spa index.html
```

### 2. **Deploy em Servidor Web**

#### Requisitos:
- ✅ HTTPS habilitado (certificado SSL válido)
- ✅ CORS configurado corretamente (se necessário)
- ✅ Service Worker registrado (arquivo `sw.js`)
- ✅ Manifest.json acessível
- ✅ Ícones nos tamanhos corretos (192x192 e 512x512)

#### Pastas Necessárias:
```
/escala-louvor/
├── index.html
├── app.js
├── styles.css
├── sw.js
├── manifest.json
├── icon-192.jpg
├── icon-512.jpg
└── (outros arquivos)
```

### 3. **Hosts Populares para Deploy**

#### **Netlify** (Recomendado - Fácil)
```bash
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod --dir .

# Acesso automático via HTTPS
```

#### **Vercel** (Excelente para PWA)
```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

#### **GitHub Pages** + CloudFlare
1. Faça push do código para GitHub
2. Configure GitHub Pages em Settings
3. Use CloudFlare como CDN (com HTTPS)

#### **Servidor Apache/Nginx Próprio**
```nginx
# nginx.conf example
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json text/css application/javascript;
    
    # Cache settings
    add_header Cache-Control "public, max-age=3600";
    
    # Service Worker - sem cache
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Manifest - sem cache
    location = /manifest.json {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    root /var/www/html/escala-louvor;
    index index.html;
    
    # SPA fallback
    try_files $uri $uri/ /index.html;
}
```

## 📦 Arquivo de Configuração

### manifest.json
Contém metadados da aplicação:
- Nome e ícone da aplicação
- Cores do tema
- Modo de exibição (standalone)
- Atalhos da tela inicial
- Categorias

### sw.js (Service Worker)
Gerencia:
- Cache de arquivos estáticos
- Funcionamento offline
- Sincronização de dados
- Atualizações do aplicativo

## 🔐 Segurança

### Boas Práticas Implementadas:
- ✅ localStorage para dados sensíveis do usuário
- ✅ Validação de entrada em todos os formulários
- ✅ Sem armazenamento de senhas (apenas verificação em tempo de execução)
- ✅ Dados isolados por usuário (sessionStorage)

### Recomendações Adicionais:
- 🔒 Use HTTPS em produção (obrigatório)
- 🔑 Considere adicionar autenticação via OAuth
- 🛡️ Implemente CORS corretamente
- 📊 Monitore o uso do localStorage
- 🔄 Atualize o certificado SSL regularmente

## 📊 Monitoramento

### Verificar Instalação do Service Worker:
1. Abra DevTools (F12)
2. Vá para **Application** → **Service Workers**
3. Confirme que `sw.js` está **registered e running**

### Verificar Cache:
1. DevTools → **Application** → **Storage** → **Cache Storage**
2. Procure por `adorascale-cache-v1`
3. Verifique quais arquivos estão em cache

### Verificar Manifest:
1. DevTools → **Application** → **Manifest**
2. Confirme que nome, ícones e cores aparecem corretamente

## 🐛 Solução de Problemas

### Problema: Service Worker não registra
- ✓ Confirme HTTPS ativado
- ✓ Verifique console (F12) para erros
- ✓ Limpe cache do navegador
- ✓ Recarregue a página

### Problema: Ícone não aparece na instalação
- ✓ Confirme que icon-192.jpg e icon-512.jpg existem
- ✓ Verifique tamanho exato (192x192 e 512x512 pixels)
- ✓ Limpe o cache do navegador
- ✓ Aguarde ~5 minutos para atualização

### Problema: Aplicativo não funciona offline
- ✓ Verifique se Service Worker está ativo
- ✓ Confirme arquivo `sw.js` é acessível
- ✓ Verifique console para erros de cache

### Problema: Dados não sincronizam entre dispositivos
- ✓ Isso é comportamento esperado (dados locais no dispositivo)
- ✓ Para sincronização, implemente backend com database

## 📱 Teste em Diferentes Dispositivos

Recomendamos testar em:
- ✅ Chrome/Edge Desktop
- ✅ Chrome Android
- ✅ Safari iPhone/iPad
- ✅ Samsung Internet (Android)
- ✅ Firefox (suporte limitado)

## 🚀 Próximas Melhorias Sugeridas

1. **Backend Sync**: Sincronizar escalas entre dispositivos
2. **Push Notifications**: Notificações de novas escalas
3. **Offline-First Database**: IndexedDB ao invés de localStorage
4. **Dark Mode Toggle**: Alternância de tema
5. **Export/Import**: Backup e restauração de dados
6. **Analytics**: Rastrear uso do aplicativo

## 📞 Suporte

Para problemas com PWA:
- Consulte [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- Verifique [Lighthouse Report](https://developers.google.com/web/tools/lighthouse) para otimizações
- Teste em [PWA Builder](https://www.pwabuilder.com)

---

**AdoraScale PWA** - Pronto para instalar e usar offline! 🎵
