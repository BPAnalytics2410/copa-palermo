/**
 * Servidor local para ver la página del campeonato antes de publicarla.
 * No necesita internet ni instalar nada: solo Node.
 *
 * Uso:  node servidor.js          (o doble clic en "VER EN LOCAL.bat")
 * Después abrí:  http://localhost:4173
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = Number(process.argv[2]) || 4173;
const RAIZ = __dirname;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff2':'font/woff2',
  '.txt':  'text/plain; charset=utf-8'
};

const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';

  /* nunca salir de la carpeta web/ */
  const archivo = path.join(RAIZ, path.normalize(rel).replace(/^(\.\.[\/\\])+/, ''));
  if (!archivo.startsWith(RAIZ)) {
    res.writeHead(403); res.end('Prohibido');
    return;
  }

  fs.readFile(archivo, (err, datos) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404</h1><p>No encontré ' + rel + '</p>');
      return;
    }
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'          /* siempre la versión más nueva */
    });
    res.end(datos);
  });
});

servidor.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.log('\n  El puerto ' + PUERTO + ' ya está ocupado.');
    console.log('  Probablemente ya lo tenés abierto: entrá a http://localhost:' + PUERTO);
    console.log('  O usá otro puerto:  node servidor.js 4174\n');
  } else {
    console.log('\n  Error: ' + e.message + '\n');
  }
});

servidor.listen(PUERTO, () => {
  const url = 'http://localhost:' + PUERTO;
  console.log('');
  console.log('  ==================================================');
  console.log('     COPA MAMA JULIA - servidor local activo');
  console.log('  ==================================================');
  console.log('');
  console.log('   Direccion:  ' + url);
  console.log('');
  console.log('   Para cerrarlo: Ctrl + C, o cerra esta ventana.');
  console.log('');

  /* Abre el navegador recien ahora, cuando el servidor YA esta escuchando.
     Si se abre antes, Chrome muestra "no se puede acceder a este sitio".   */
  if (process.argv.indexOf('--no-abrir') < 0) {
    const { spawn } = require('child_process');
    const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', url]]
              : process.platform === 'darwin' ? ['open', [url]]
              : ['xdg-open', [url]];
    try { spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore' }).unref(); }
    catch (e) { console.log('   (abrilo a mano en el navegador)'); }
  }
});
