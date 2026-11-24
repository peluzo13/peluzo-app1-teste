// Gera web/index.html (versão instalável) e copia para o app Android.
// Uso: node scripts/build.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const body = fs.readFileSync(path.join(root, 'web/app.html'), 'utf8');
const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0c0e13">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Liberto">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'web/index.html'), html);
const assets = path.join(root, 'app/src/main/assets');
fs.mkdirSync(assets, { recursive: true });
fs.writeFileSync(path.join(assets, 'index.html'), html);
fs.copyFileSync(path.join(root, 'web/biblia.json'), path.join(assets, 'biblia.json'));
console.log('ok: web/index.html + app/src/main/assets/{index.html,biblia.json}');
