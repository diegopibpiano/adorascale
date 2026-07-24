#!/usr/bin/env node

/**
 * AdoraScale PWA Development Server
 * Servidor simples com suporte a HTTPS para testes locais de PWA
 * 
 * Uso:
 *   node server.js              # HTTP na porta 8080
 *   node server.js --https      # HTTPS na porta 8443
 *   node server.js --port 3000  # Custom port
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configurações
const args = process.argv.slice(2);
const useHttps = args.includes('--https');
const portArg = args.find((arg, i) => args[i - 1] === '--port');
const port = portArg ? parseInt(portArg) : (useHttps ? 8443 : 8080);

// Tipos MIME
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

// Handler de requisição
const requestHandler = (req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove trailing slash
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Rota padrão
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Caminho do arquivo
  let filePath = path.join(__dirname, pathname);

  // Segurança: evitar path traversal
  const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
  if (!normalizedPath.startsWith(path.normalize(__dirname))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Se for diretório, tenta index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Verifica se arquivo existe
  if (!fs.existsSync(filePath)) {
    // Para SPA, retorna index.html
    if (pathname.startsWith('/') && !pathname.includes('.')) {
      filePath = path.join(__dirname, 'index.html');
    }
  }

  // Se ainda não existe, retorna 404
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    console.log(`❌ 404: ${pathname}`);
    return;
  }

  // Obtém extensão
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Define headers de cache
  const cacheControl = ext === '.js' || ext === '.css' ? 'public, max-age=3600' : 'no-cache, no-store, must-revalidate';
  
  // Service Worker e Manifest nunca devem ser cacheados
  const isServiceWorker = filePath.endsWith('sw.js');
  const isManifest = filePath.endsWith('manifest.json');
  const noCacheHeaders = isServiceWorker || isManifest ? 'no-cache, no-store, must-revalidate' : cacheControl;

  // Headers de segurança
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': noCacheHeaders,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Access-Control-Allow-Origin': '*',
  });

  // Envia arquivo
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  
  fileStream.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
    console.error(`❌ Erro ao servir ${pathname}:`, err.message);
  });

  console.log(`✓ ${req.method} ${pathname} [${contentType}]`);
};

// Criar servidor
let server;
if (useHttps) {
  // Gera certificado autoassinado se não existir
  const keyFile = path.join(__dirname, 'server.key');
  const certFile = path.join(__dirname, 'server.crt');

  if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
    console.log('⚠️  Certificados SSL não encontrados. Gerando certificados autoassinados...');
    
    const { execSync } = require('child_process');
    try {
      execSync(`openssl req -x509 -newkey rsa:4096 -nodes -out ${certFile} -keyout ${keyFile} -days 365 -subj "/CN=localhost"`, {
        stdio: 'ignore'
      });
      console.log('✓ Certificados gerados com sucesso!');
    } catch (e) {
      console.error('❌ Erro ao gerar certificados. Certifique-se de ter OpenSSL instalado.');
      process.exit(1);
    }
  }

  const options = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
  };

  server = https.createServer(options, requestHandler);
} else {
  server = http.createServer(requestHandler);
}

// Inicia servidor
server.listen(port, () => {
  const protocol = useHttps ? 'HTTPS' : 'HTTP';
  const url = `${protocol.toLowerCase()}://localhost:${port}`;
  
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     AdoraScale Development Server      ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`📍 ${protocol} Server rodando em: ${url}`);
  console.log('');
  console.log('💡 Para testar PWA, use HTTPS:');
  console.log('   node server.js --https');
  console.log('');
  console.log('⚠️  Aviso HTTPS: Certificados autoassinados não são confiáveis');
  console.log('   Em produção, use certificados válidos (Let\\'s Encrypt, etc)');
  console.log('');
  console.log('Pressione Ctrl+C para encerrar');
  console.log('');
});

// Handle errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${port} já está em uso!`);
    process.exit(1);
  } else {
    console.error('❌ Erro do servidor:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando servidor...');
  server.close(() => {
    console.log('✓ Servidor encerrado');
    process.exit(0);
  });
});
