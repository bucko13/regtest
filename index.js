#!/usr/bin/env node

'use strict';

process.title = 'bcoin';
(async () => {
  const { FullNode } = require('bcoin');
  const { WalletClient, NodeClient } = require('bclient')

  const node = new FullNode({
    network: 'regtest',
    memory: true,
    logLevel: 'none',
    witness: true
  })

  const plugin = require('bcoin/lib/wallet/plugin');
  node.use(plugin);

  const wClient = new WalletClient({ network: 'regtest', port: 48334, witness: true })
  const client = new NodeClient({ network: 'regtest', port: 48332 })

  const wallet = wClient.wallet('primary')

  process.on('SIGINT', async () => await node.close())
  await node.ensure();
  await node.open();
  await node.connect();
  node.startSync();

  const {address} = await wallet.createAddress('default')
  await client.execute('generatetoaddress', [100, address])
  console.log('address:', address)

})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
