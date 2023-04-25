import { ChainId } from "protoss-exchange-sdk";

export const ROUTER_ADDRESSES: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]:
    "0x07a0922657e550ba1ef76531454cb6d203d4d168153a0f05671492982c2f7741",
  [ChainId.TESTNET]:
    "0x02e071eb551c4b084b751947ad172c3b210176ed2fc679c5e9c2cc47db91df2f",
};

export const ROUTER_ADDRESSES_DECIMAL: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]:
    "3449894159148515219798745803052838533987600172814376284748500123270373144385",
  [ChainId.TESTNET]:
    "1301185681564728876830591934736915460504241358986458272769672409816570650415",
};

export const FACTORY_ADDRESS: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]: "",
  [ChainId.TESTNET]:
    "0x0017b7cdbd6dd86b4b9baf572e040e74bd44b419dcbb6f38a2e936aec9327b8e",
};

export const STARKNET_ID_ADDRESSES: {
  [chainId in ChainId]: string;
} = {
  [ChainId.MAINNET]:
    "0x06ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
  [ChainId.TESTNET]:
    "0x05cf267a0af6101667013fc6bd3f6c11116a14cda9b8c4b1198520d59f900b17",
};

export const POOL_API =
  "https://protoss-exchange-api-nrhq6ldrtq-an.a.run.app/pairs";
