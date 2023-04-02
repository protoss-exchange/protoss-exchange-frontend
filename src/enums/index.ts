import { ChainId } from 'protoss-exchange-sdk';

export const erc20TokenAddressByNetwork = {
  'goerli-alpha':
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  'mainnet-alpha':
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
};

export const STARKNET_WALLET_NAME = '_wallet_name';
export const SERVER_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://api.10kswap.com',
  [ChainId.TESTNET]: 'https://goerli-api.10kswap.com',
};
export enum StarknetChainId {
  MAINNET = '0x534e5f4d41494e', // encodeShortString('SN_MAIN'),
  TESTNET = '0x534e5f474f45524c49', // encodeShortString('SN_GOERLI'),
}
export enum TransactionHashPrefix {
  DECLARE = '0x6465636c617265', // encodeShortString('declare'),
  DEPLOY = '0x6465706c6f79', // encodeShortString('deploy'),
  INVOKE = '0x696e766f6b65', // encodeShortString('invoke'),
  L1_HANDLER = '0x6c315f68616e646c6572', // encodeShortString('l1_handler'),
}
export const CONTRACT_ADDRESS =
  '0x06f5a85cfdadca8a90f7b99c99afd992a149e853a641257db99cf50bc2093ed7';

export const ROUTER_ADDRESS =
  '0x064ee214c54f4e3e43fcca70cb518f6eca85a29548a3eaa2da67fe9ac4a866e4';
export const ROUTER_ADDRESS_DECIMAL =
  '2853251517204766224103865475000826182578748023448290093960343823724355020516';
export const DECIMAL = 1000000000000000000;
