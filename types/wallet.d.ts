// TypeScript declarations for Cosmos wallet extensions

interface Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>;
    getKey: (chainId: string) => Promise<{
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: Uint8Array;
      bech32Address: string;
    }>;
    getOfflineSigner: (chainId: string) => any;
    experimentalSuggestChain: (chainInfo: any) => Promise<void>;
    signArbitrary: (chainId: string, signer: string, data: string | Uint8Array) => Promise<any>;
  };

  leap?: {
    enable: (chainId: string) => Promise<void>;
    getKey: (chainId: string) => Promise<{
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: Uint8Array;
      bech32Address: string;
    }>;
    getOfflineSigner: (chainId: string) => any;
    experimentalSuggestChain: (chainInfo: any) => Promise<void>;
    signArbitrary: (chainId: string, signer: string, data: string | Uint8Array) => Promise<any>;
  };

  cosmostation?: {
    enable: (chainId: string) => Promise<void>;
    getKey: (chainId: string) => Promise<{
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: Uint8Array;
      bech32Address: string;
    }>;
    getOfflineSigner: (chainId: string) => any;
    signArbitrary: (chainId: string, signer: string, data: string | Uint8Array) => Promise<any>;
  };
}
