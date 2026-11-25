// Envia o lembrete do horário para o iPhone (Web Push).
// Usa os mesmos devocionais do app (web/app.html) e o mesmo cálculo de "devocional do dia".
// Segredos no GitHub: VAPID_PRIVATE_KEY e PUSH_SUBSCRIPTION. SLOT opcional: manha | noite | dormir.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const VAPID_PUBLIC = 'BAK7y0Ae4q6LQEABW1fzzS2OX-oOPY27L32M9gvntmDE_3pAr7a6t1ov2VcauHWikTykG93v9tzNBxnYXsEjeKI';
const DAY = 86400000;

function extract(src, start, end) {
  const a = src.indexOf(start); if (a < 0) throw new Error('não achei ' + start);
  const b = src.indexOf(end, a);
  return Function('"use strict";return (' + src.slice(a + start.length - 1, b + end.length - 1) + ')')();
}
const html = fs.readFileSync(path.join(root, 'web/app.html'), 'utf8');
const DEVOS = extract(html, 'const DEVOS = [', '\n  ];');
const BOOKS = extract(html, 'const BOOKS = [', '];');
const BIBLE = JSON.parse(fs.readFileSync(path.join(root, 'web/biblia.json'), 'utf8'));

// Data e hora de Brasília
const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
  .formatToParts(new Date()).map(p => [p.type, p.value]));
const dayNum = Math.floor(Date.UTC(+parts.year, +parts.month - 1, +parts.day) / DAY);
const hour = +parts.hour;
const slot = process.env.SLOT || (hour >= 4 && hour < 12 ? 'manha' : hour >= 12 && hour < 22 ? 'noite' : 'dormir');

function devoMessage() {
  const i = dayNum % DEVOS.length, d = DEVOS[i], [b, c, v1, v2] = d[1];
  let verse = BIBLE[b][c - 1].slice(v1 - 1, v2).join(' ').replace(/^[A-ZÁÉ][a-záéíóúçã]{1,8}:(?=\S)/, '');
  if (b === 18 && v1 === 1) verse = verse.replace(/^Salmo[^:]{0,60}:\s*/, '');
  if (verse.length > 110) verse = verse.slice(0, 107).replace(/\s+\S*$/, '') + '…';
  const ref = BOOKS[b] + ' ' + c + ':' + v1 + (v2 > v1 ? '–' + v2 : '');
  return { title: 'Devocional de hoje: ' + d[0], body: '“' + verse + '” ' + ref, url: './#devocional', tag: 'firme-devo' };
}
const NOITE = [
  'A noite é quando a batalha aperta. Fique firme: se bater a tentação, abra o botão de pânico.',
  'Deus é fiel e não vai deixar você ser tentado além das suas forças. Fique firme hoje.',
  'Mais um dia limpo está quase completo. Não troque a vitória de hoje por um minuto de prazer.',
  'Vigie e ore. Deixe o celular longe da cama e entregue esta noite a Deus.',
  'Lembre-se dos seus motivos. Você não está sozinho nesta luta.',
  'Se estiver sozinho e entediado, levante e mude de lugar. Pequenas decisões vencem grandes batalhas.',
  'Cristo te libertou para viver livre. Fique firme esta noite.',
];
const DORMIR = [
  'Hora de largar o celular. Descanse em paz: amanhã há misericórdia nova.',
  'Deite e durma em paz, porque só o Senhor te faz habitar em segurança (Salmos 4:8).',
  'Desligue a tela e agradeça por mais um dia. Boa noite, guerreiro.',
  'O dia acabou. Coloque o celular longe da cama e entregue a noite a Deus.',
  'Termine o dia com uma oração curta e o celular fora do quarto. Boa noite.',
];
function message() {
  if (slot === 'manha') return devoMessage();
  if (slot === 'noite') return { title: 'Fique firme', body: NOITE[dayNum % NOITE.length], url: './#inicio', tag: 'firme-noite' };
  return { title: 'Boa noite', body: DORMIR[dayNum % DORMIR.length], url: './', tag: 'firme-dormir' };
}

const msg = message();
console.log('Horário:', slot, '|', msg.title, '|', msg.body);
if (process.env.DRY_RUN) process.exit(0);

const priv = process.env.VAPID_PRIVATE_KEY, subRaw = process.env.PUSH_SUBSCRIPTION;
if (!priv || !subRaw) { console.log('Segredos VAPID_PRIVATE_KEY e/ou PUSH_SUBSCRIPTION ainda não configurados. Nada enviado.'); process.exit(0); }
const webpush = require('web-push');
webpush.setVapidDetails('https://peluzo13.github.io/peluzo-app1-teste/', VAPID_PUBLIC, priv.trim());
webpush.sendNotification(JSON.parse(subRaw), JSON.stringify(msg), { TTL: 6 * 3600, urgency: 'normal' })
  .then(r => console.log('Enviado:', r.statusCode))
  .catch(e => {
    console.error('Falhou:', e.statusCode, e.body || e.message);
    if (e.statusCode === 404 || e.statusCode === 410) console.error('O iPhone cancelou a inscrição. Ative os lembretes de novo no app e atualize o segredo PUSH_SUBSCRIPTION.');
    process.exit(1);
  });
