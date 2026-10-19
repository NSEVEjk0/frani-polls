// Frani Invoice — configuration.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';

export const NETWORK = process.env.POLLS_NETWORK || 'testnet2';

export const config = {
  network: NETWORK,
  dataDir: process.env.POLLS_DATA_DIR || './wallet-data',
  walletApiBaseUrl:
    process.env.POLLS_WALLET_API || 'https://wallet-api.unicity.network',
  // Public testnet2 oracle key — not a secret.
  oracleApiKey:
    process.env.POLLS_ORACLE_KEY || 'sk_ddc3cfcc001e4a28ac3fad7407f99590',
  deviceId: process.env.POLLS_DEVICE_ID || 'frani-polls-1',
  nametag: process.env.POLLS_NAMETAG || '',
  // Where invoices are stored as JSON.
  dataDir: process.env.POLLS_DIR || './polls',
  // UCT uses 18 decimals on Unicity testnet2.
  decimals: Number(process.env.POLLS_DECIMALS || '18'),
};

export function assertTestnet2() {
  if (config.network !== 'testnet2' && !process.env.POLLS_ALLOW_NONTESTNET2) {
    throw new Error(
      `Frani Invoice is testnet2-only. Refusing to start on '${config.network}'. ` +
        `Set POLLS_ALLOW_NONTESTNET2=1 only if you truly mean it.`,
    );
  }
}
