var rn_bridge = require('rn-bridge');

// Echo every message received from react-native.
rn_bridge.channel.on('message', msg => {
  console.log('[rn_bridge#onMessage] ===========> ', {msg});
  rn_bridge.channel.send(msg);
});

rn_bridge.channel.on('share', msg => {
  console.log('[rn_bridge#onShare] ===========> ', {msg});
  rn_bridge.channel.send(msg);
});

rn_bridge.app.on('pause', pauseLock => {
  console.log('[node] app paused.');
  pauseLock.release();
});

rn_bridge.app.on('resume', () => {
  console.log('[node] app resumed.');
  rn_bridge.channel.send('Our first moment...');
});

// Inform react-native node is initialized.
rn_bridge.channel.send('[rn_bridge] Node was initialized.');
