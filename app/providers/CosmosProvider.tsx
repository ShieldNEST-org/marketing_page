'use client';

import React from 'react';
import { ChainProvider } from '@cosmos-kit/react';

// Define Coreum chain configuration manually
const coreumChain = {
  chain_name: 'coreum',
  chain_id: 'coreum-mainnet-1',
  pretty_name: 'Coreum',
  status: 'live',
  network_type: 'mainnet',
  bech32_prefix: 'core',
  slip44: 990,
  fees: {
    fee_tokens: [
      {
        denom: 'ucore',
        fixed_min_gas_price: 0.03125,
        low_gas_price: 0.03125,
        average_gas_price: 0.0625,
        high_gas_price: 0.125,
      },
    ],
  },
  staking: {
    staking_tokens: [{ denom: 'ucore' }],
  },
  apis: {
    rpc: [
      {
        address: 'https://full-node.mainnet-1.coreum.dev:26657',
      },
    ],
    rest: [
      {
        address: 'https://full-node.mainnet-1.coreum.dev:1317',
      },
    ],
  },
};

export function CosmosProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChainProvider
      chains={[coreumChain]}
      assetLists={[]}
      wallets={[]} // Will be configured in useChain hook
      walletConnectOptions={{
        signClient: {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
        },
      }}
      wrappedWithChakra={false}
    >
      {children}
    </ChainProvider>
  );
}
