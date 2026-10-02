/* Incrusta data/campeonato.json dentro de index.html para que la pagina
   funcione tambien abriendola con doble clic (sin servidor).
   Uso:  node build.js          (desde la carpeta web/)                        */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

const json = fs.readFileSync(path.join(dir, 'data', 'campeonato.json'), 'utf8').trim();
const file = path.join(dir, 'index.html');
let html = fs.readFileSync(file, 'utf8');

const re = /\/\*SEED\*\/[\s\S]*?\/\*\/SEED\*\//;
if (!re.test(html)) {
  console.error('No encontre los marcadores /*SEED*/ ... /*\/SEED*/ en index.html');
  process.exit(1);
}
html = html.replace(re, '/*SEED*/' + json.replace(/<\/script>/gi, '<\\/script>') + '/*/SEED*/');
fs.writeFileSync(file, html);
console.log('index.html actualizado con ' + (json.length / 1024).toFixed(1) + ' KB de datos incrustados');
