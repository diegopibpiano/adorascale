# 🎵 AdoraScale - Progressive Web App

**AdoraScale** é um aplicativo web progressivo (PWA) para gerenciar escalas de louvor, músicas e repertório do ministério em sua igreja.

## ✨ Recursos Principais

### 📊 Gestão de Escalas
- Criar, editar e excluir escalas de culto
- Atribuir músicos a diferentes instrumentos
- Controlar confirmação de presença
- Organizar por mês
- **Novo**: Adicionar tema da pregação e versículos base

### 🎵 Repertório de Músicas
- Catalogar músicas com tom, artista e link de cifra
- Organizar setlist por culto
- Buscar e filtrar músicas
- Reordenar músicas na setlist

### 👥 Gerenciamento de Membros
- Cadastrar integrantes da equipe
- Definir funções/instrumentos
- Incluir telefone para notificações
- Novo: Vocal Tenor, Contralto e Soprano

### 🔐 Sistema de Acesso
- Autenticação com usuário e senha
- 100 usuários (1 admin + 99 regulares)
- Gestão de acessos via admin
- Papéis: Administrador e Regular

### 💬 Notificações
- Enviar aviso via WhatsApp (individual ou grupo)
- Notificações PWA desktop
- Alertas de indisponibilidade

### 📱 Funcionalidades PWA
- Instale na tela inicial (todos os dispositivos)
- Funciona offline
- Ícone na tela inicial
- Modo fullscreen (sem barra de navegador)
- Sincronização automática

## 🚀 Quick Start

### 1. **Instalação Local (Desenvolvimento)**

#### Opção A: Node.js
```bash
# Clone ou baixe os arquivos
cd escala-louvor

# Inicie o servidor HTTPS
npm install
npm run dev
```

Acesse: `https://localhost:8443`

#### Opção B: Python
```bash
# Python 3.8+
python -m http.server 8080
```

Acesse: `http://localhost:8080`

> ⚠️ **Nota**: PWA requer HTTPS! Use Node.js para desenvolvimento com HTTPS.

### 2. **Instalação no Smartphone**

#### 🍎 iOS (iPhone/iPad)
1. Abra Safari
2. Vá para `https://seu-site.com`
3. Toque Compartilhar → Adicionar à Tela Inicial
4. Escolha um nome e toque Adicionar

#### 🤖 Android
1. Abra Chrome/Edge
2. Vá para `https://seu-site.com`
3. Toque o menu (⋮) → Instalar aplicativo
4. Confirme a instalação

### 3. **Deploy em Produção**

Recomendações:
- **Netlify**: Deploy automático via Git (HTTPS incluído)
- **Vercel**: Otimizado para PWA (HTTPS incluído)
- **GitHub Pages + CloudFlare**: Gratuito (HTTPS via CloudFlare)
- **Servidor próprio**: Apache/Nginx com SSL

Veja [PWA_README.md](./PWA_README.md) para detalhes de deployment.

## 👤 Contas de Teste

### Admin
- **Usuário**: `admin`
- **Senha**: `adoracao123`

### Usuário Regular
- **Usuários**: `user1` a `user99`
- **Senha**: `senha123`

## 📁 Estrutura de Arquivos

```
escala-louvor/
├── index.html           # Interface principal
├── app.js              # Lógica da aplicação
├── styles.css          # Estilos
├── sw.js               # Service Worker (offline)
├── manifest.json       # Configuração PWA
├── server.js           # Servidor desenvolvimento
├── package.json        # Dependências Node
├── icon-192.jpg        # Ícone pequeno
├── icon-512.jpg        # Ícone grande
├── PWA_README.md       # Guia completo PWA
└── README.md           # Este arquivo
```

## 🔑 Credenciais de Administrador

- **Usuário**: `admin`
- **Senha**: `adoracao123`

Após fazer login como admin:
- Gerenciar usuários
- Alterar confirmação de presença de qualquer membro
- Enviar escalas para o grupo via WhatsApp
- Criar e editar todas as escalas

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Servidor HTTPS para testes PWA
npm run dev

# Servidor HTTP simples
npm start

# Servidor HTTP em porta custom
npm run start:port 3000
```

### Tecnologias Utilizadas

- **HTML5**: Markup semântico
- **CSS3**: Responsive design
- **Vanilla JavaScript**: Sem frameworks
- **Service Worker**: Funcionamento offline
- **LocalStorage**: Persistência de dados
- **PWA API**: Notificações e instalação

### Navegadores Suportados

| Navegador | Desktop | Mobile |
|-----------|---------|--------|
| Chrome    | ✅      | ✅     |
| Edge      | ✅      | ✅     |
| Safari    | ✅      | ✅*    |
| Firefox   | ⚠️      | ⚠️     |

*Safari no iOS tem suporte limitado a PWA

## 🔐 Segurança

- ✅ Dados armazenados localmente no dispositivo
- ✅ Sem requisições para servidor (funciona offline)
- ✅ Sem exposição de senhas
- ✅ Validação em tempo real
- ⚠️ **HTTPS obrigatório** em produção

## 📊 Dados Persistidos

Todos os dados são salvos no `localStorage` do navegador:
- Escalas de culto
- Músicas
- Integrantes
- Usuários e acessos
- Confirmações de presença

**Backup**: Use a opção "Exportar Backup" na aba Configurações

## 📱 Modo Offline

O aplicativo funciona completamente offline após a primeira visita:
- ✅ Visualizar escalas e músicas
- ✅ Editar informações
- ✅ Confirmar presença
- ✅ Enviar mensagens WhatsApp (quando online)

Dados sincronizam automaticamente quando volta a ficar online.

## 🐛 Troubleshooting

### Problema: Aplicativo não abre offline
**Solução**: 
1. Verifique se o Service Worker está registrado (DevTools → Application)
2. Limpe cache e recarregue
3. Verifique se está usando HTTPS (PWA requer HTTPS)

### Problema: Não consigo instalar
**Solução**:
1. Use HTTPS
2. Use navegador Chrome/Edge (Safari é limitado)
3. Aguarde alguns segundos, banner deve aparecer
4. Se não aparecer, toque no menu (⋮) e procure "Instalar"

### Problema: Ícone não aparece
**Solução**:
1. Limpe cache do navegador
2. Aguarde 5-10 minutos
3. Tente em outro navegador
4. Verifique se `manifest.json` é válido

## 💡 Dicas

### Para Melhor Experiência:
1. Use em modo fullscreen após instalar
2. Mantenha o navegador atualizado
3. Backup regular de dados (Configurações → Exportar)
4. Use WiFi para melhor performance

### Para Administradores:
1. Crie nomes de usuário fáceis de lembrar
2. Comunique as credenciais com segurança
3. Verifique regularmente confirmações de presença
4. Use a função "Enviar Grupo" para comunicar escalas

## 📞 Suporte

### Documentação Completa
Veja [PWA_README.md](./PWA_README.md) para:
- Instruções detalhadas de instalação
- Guia de deployment
- Solução de problemas avançados
- Próximas melhorias sugeridas

### Recursos Úteis
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com)
- [Lighthouse Audit](https://developers.google.com/web/tools/lighthouse)

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar

## 🙏 Créditos

Desenvolvido com ❤️ para ministérios de louvor

---

**AdoraScale** - Gestão de Escalas de Louvor Simplificada 🎵

Versão: 1.0.0 | Ultima atualização: 2026-07-24
=======
# 🎵 AdoraScale - Progressive Web App

**AdoraScale** é um aplicativo web progressivo (PWA) para gerenciar escalas de louvor, músicas e repertório do ministério em sua igreja.

## ✨ Recursos Principais

### 📊 Gestão de Escalas
- Criar, editar e excluir escalas de culto
- Atribuir músicos a diferentes instrumentos
- Controlar confirmação de presença
- Organizar por mês
- **Novo**: Adicionar tema da pregação e versículos base

### 🎵 Repertório de Músicas
- Catalogar músicas com tom, artista e link de cifra
- Organizar setlist por culto
- Buscar e filtrar músicas
- Reordenar músicas na setlist

### 👥 Gerenciamento de Membros
- Cadastrar integrantes da equipe
- Definir funções/instrumentos
- Incluir telefone para notificações
- Novo: Vocal Tenor, Contralto e Soprano

### 🔐 Sistema de Acesso
- Autenticação com usuário e senha
- 100 usuários (1 admin + 99 regulares)
- Gestão de acessos via admin
- Papéis: Administrador e Regular

### 💬 Notificações
- Enviar aviso via WhatsApp (individual ou grupo)
- Notificações PWA desktop
- Alertas de indisponibilidade

### 📱 Funcionalidades PWA
- Instale na tela inicial (todos os dispositivos)
- Funciona offline
- Ícone na tela inicial
- Modo fullscreen (sem barra de navegador)
- Sincronização automática

## 🚀 Quick Start

### 1. **Instalação Local (Desenvolvimento)**

#### Opção A: Node.js
```bash
# Clone ou baixe os arquivos
cd escala-louvor

# Inicie o servidor HTTPS
npm install
npm run dev
```

Acesse: `https://localhost:8443`

#### Opção B: Python
```bash
# Python 3.8+
python -m http.server 8080
```

Acesse: `http://localhost:8080`

> ⚠️ **Nota**: PWA requer HTTPS! Use Node.js para desenvolvimento com HTTPS.

### 2. **Instalação no Smartphone**

#### 🍎 iOS (iPhone/iPad)
1. Abra Safari
2. Vá para `https://seu-site.com`
3. Toque Compartilhar → Adicionar à Tela Inicial
4. Escolha um nome e toque Adicionar

#### 🤖 Android
1. Abra Chrome/Edge
2. Vá para `https://seu-site.com`
3. Toque o menu (⋮) → Instalar aplicativo
4. Confirme a instalação

### 3. **Deploy em Produção**

Recomendações:
- **Netlify**: Deploy automático via Git (HTTPS incluído)
- **Vercel**: Otimizado para PWA (HTTPS incluído)
- **GitHub Pages + CloudFlare**: Gratuito (HTTPS via CloudFlare)
- **Servidor próprio**: Apache/Nginx com SSL

Veja [PWA_README.md](./PWA_README.md) para detalhes de deployment.

## 👤 Contas de Teste

### Admin
- **Usuário**: `admin`
- **Senha**: `adoracao123`

### Usuário Regular
- **Usuários**: `user1` a `user99`
- **Senha**: `senha123`

## 📁 Estrutura de Arquivos

```
escala-louvor/
├── index.html           # Interface principal
├── app.js              # Lógica da aplicação
├── styles.css          # Estilos
├── sw.js               # Service Worker (offline)
├── manifest.json       # Configuração PWA
├── server.js           # Servidor desenvolvimento
├── package.json        # Dependências Node
├── icon-192.jpg        # Ícone pequeno
├── icon-512.jpg        # Ícone grande
├── PWA_README.md       # Guia completo PWA
└── README.md           # Este arquivo
```

## 🔑 Credenciais de Administrador

- **Usuário**: `admin`
- **Senha**: `adoracao123`

Após fazer login como admin:
- Gerenciar usuários
- Alterar confirmação de presença de qualquer membro
- Enviar escalas para o grupo via WhatsApp
- Criar e editar todas as escalas

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Servidor HTTPS para testes PWA
npm run dev

# Servidor HTTP simples
npm start

# Servidor HTTP em porta custom
npm run start:port 3000
```

### Tecnologias Utilizadas

- **HTML5**: Markup semântico
- **CSS3**: Responsive design
- **Vanilla JavaScript**: Sem frameworks
- **Service Worker**: Funcionamento offline
- **LocalStorage**: Persistência de dados
- **PWA API**: Notificações e instalação

### Navegadores Suportados

| Navegador | Desktop | Mobile |
|-----------|---------|--------|
| Chrome    | ✅      | ✅     |
| Edge      | ✅      | ✅     |
| Safari    | ✅      | ✅*    |
| Firefox   | ⚠️      | ⚠️     |

*Safari no iOS tem suporte limitado a PWA

## 🔐 Segurança

- ✅ Dados armazenados localmente no dispositivo
- ✅ Sem requisições para servidor (funciona offline)
- ✅ Sem exposição de senhas
- ✅ Validação em tempo real
- ⚠️ **HTTPS obrigatório** em produção

## 📊 Dados Persistidos

Todos os dados são salvos no `localStorage` do navegador:
- Escalas de culto
- Músicas
- Integrantes
- Usuários e acessos
- Confirmações de presença

**Backup**: Use a opção "Exportar Backup" na aba Configurações

## 📱 Modo Offline

O aplicativo funciona completamente offline após a primeira visita:
- ✅ Visualizar escalas e músicas
- ✅ Editar informações
- ✅ Confirmar presença
- ✅ Enviar mensagens WhatsApp (quando online)

Dados sincronizam automaticamente quando volta a ficar online.

## 🐛 Troubleshooting

### Problema: Aplicativo não abre offline
**Solução**: 
1. Verifique se o Service Worker está registrado (DevTools → Application)
2. Limpe cache e recarregue
3. Verifique se está usando HTTPS (PWA requer HTTPS)

### Problema: Não consigo instalar
**Solução**:
1. Use HTTPS
2. Use navegador Chrome/Edge (Safari é limitado)
3. Aguarde alguns segundos, banner deve aparecer
4. Se não aparecer, toque no menu (⋮) e procure "Instalar"

### Problema: Ícone não aparece
**Solução**:
1. Limpe cache do navegador
2. Aguarde 5-10 minutos
3. Tente em outro navegador
4. Verifique se `manifest.json` é válido

## 💡 Dicas

### Para Melhor Experiência:
1. Use em modo fullscreen após instalar
2. Mantenha o navegador atualizado
3. Backup regular de dados (Configurações → Exportar)
4. Use WiFi para melhor performance

### Para Administradores:
1. Crie nomes de usuário fáceis de lembrar
2. Comunique as credenciais com segurança
3. Verifique regularmente confirmações de presença
4. Use a função "Enviar Grupo" para comunicar escalas

## 📞 Suporte

### Documentação Completa
Veja [PWA_README.md](./PWA_README.md) para:
- Instruções detalhadas de instalação
- Guia de deployment
- Solução de problemas avançados
- Próximas melhorias sugeridas

### Recursos Úteis
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com)
- [Lighthouse Audit](https://developers.google.com/web/tools/lighthouse)

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar

## 🙏 Créditos

Desenvolvido com ❤️ para ministérios de louvor

---

**AdoraScale** - Gestão de Escalas de Louvor Simplificada 🎵

Versão: 1.0.0 | Ultima atualização: 2026-07-24
