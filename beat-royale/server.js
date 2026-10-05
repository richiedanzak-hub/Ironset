// Start Beat Royale:  node server.js   (or: npm start)
import { createApp, lanUrl } from './src/app.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
const { server } = createApp({ port });

server.listen(port, host, () => {
  const lan = lanUrl(port);
  console.log('\n  🎧 Beat Royale is running\n');
  console.log(`  On this computer:     http://localhost:${port}`);
  if (lan) console.log(`  Phones on your Wi-Fi: ${lan}`);
  console.log('  Music data:           Deezer (no key needed)');
  console.log('');
});

const stop = () => server.close(() => process.exit(0)).closeAllConnections();
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
