// Blood Chain Pakistan — whatsapp-web.js PILOT bot.
// ⚠️ Testing only. whatsapp-web.js automates WhatsApp Web (unofficial) and can
// get a number BANNED. Use a DEDICATED test number, never the main NGO line.
// Production should move to the Meta WhatsApp Cloud API.
require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { pollOpenRequests, handleInbound, DRY_RUN } = require('./lib/relay');

const POLL_MS = Number(process.env.POLL_INTERVAL_MS || 20000);

const client = new Client({
  // LocalAuth persists the session in .wwebjs_auth so you scan the QR only once.
  authStrategy: new LocalAuth({ clientId: 'bcp-bot' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(process.env.PUPPETEER_EXECUTABLE_PATH
      ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH }
      : {}),
  },
});

client.on('qr', (qr) => {
  console.log('\nScan this QR with the bot’s WhatsApp (Linked Devices):\n');
  qrcode.generate(qr, { small: true });
});

let timer = null;

client.on('authenticated', () => console.log('Authenticated ✓'));
client.on('auth_failure', (m) => console.error('Auth failure:', m));
client.on('disconnected', (reason) => {
  console.error('Disconnected:', reason);
  if (timer) { clearInterval(timer); timer = null; }
  // Auto-recover so an unattended bot survives transient drops. A genuine
  // LOGOUT will reprint the QR so you can re-link the device.
  setTimeout(() => {
    console.log('Reconnecting…');
    client.initialize().catch((e) => console.error('Reconnect failed:', e.message));
  }, 10000);
});

client.on('ready', () => {
  console.log(`\nBCP bot ready ✓  (DRY_RUN=${DRY_RUN}, polling every ${POLL_MS}ms)`);
  if (DRY_RUN) console.log('DRY_RUN is on — messages are LOGGED, not sent. Set DRY_RUN=false to go live.\n');
  const tick = async () => {
    try {
      await pollOpenRequests(client);
    } catch (e) {
      console.error('poll loop error:', e.message);
    }
  };
  tick();
  timer = setInterval(tick, POLL_MS);
});

client.on('message', async (msg) => {
  // Ignore group chats and status broadcasts; only handle 1:1 donor replies.
  if (msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
  try {
    await handleInbound(client, msg.from, msg.body);
  } catch (e) {
    console.error('inbound error:', e.message);
  }
});

function shutdown() {
  console.log('\nShutting down…');
  if (timer) clearInterval(timer);
  client.destroy().finally(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

client.initialize();
