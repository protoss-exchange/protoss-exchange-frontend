import { Token, ChainId } from 'protoss-exchange-sdk';
import { DECIMAL } from './index';
// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const tokens: ChainTokenList = {
  [ChainId.MAINNET]: [
    new Token(
      ChainId.MAINNET,
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      18,
      'ETH',
      'Ether'
    ),
    new Token(
      ChainId.MAINNET,
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      6,
      'USDC',
      'USD Coin'
    ),
    new Token(
      ChainId.MAINNET,
      '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
      18,
      'DAI',
      'Dai Stablecoin'
    ),
    new Token(
      ChainId.MAINNET,
      '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
      8,
      'WBTC',
      'Wrapped BTC'
    ),
    new Token(
      ChainId.MAINNET,
      '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      6,
      'USDT',
      'Tether USD'
    ),
  ],
  [ChainId.TESTNET]: [
    // new Token(
    //   ChainId.TESTNET,
    //   '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    //   18,
    //   'ETH',
    //   'Ether'
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9',
    //   18,
    //   'DAI',
    //   'Dai Stablecoin'
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426',
    //   6,
    //   'USDC',
    //   'Goerli USD Coin'
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   '0x02e2faab2cad8ecdde5e991798673ddcc08983b872304a66e5f99fbb24e14abc',
    //   6,
    //   'TKA',
    //   'TestMainnet Token'
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   '0x0250a29c8cd4d07a4db0516798fe86225e362439e769c9a0e1640d4a8ec12883',
    //   6,
    //   'TKB',
    //   'TestMainnet Token'
    // ),
    new Token(
      ChainId.TESTNET,
      '0x058e4cf84d5c9d7c6e5f3fdd4d2d7186566f39fa67bdd1f24f91c41b4c095fcb',
      18,
      'TOA',
      'Token A'
    ),
    new Token(
      ChainId.TESTNET,
      '0x0401d06bd0e3e0d2cca6eead7bb20ec5d6ad4f48a27b2ce00e416f89cbd5d011',
      18,
      'TOB',
      'Token B'
    ),
    new Token(
      ChainId.TESTNET,
      '0x06f5a85cfdadca8a90f7b99c99afd992a149e853a641257db99cf50bc2093ed7',
      18,
      'TOC',
      'Token C'
    ),
  ],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    new Token(
      ChainId.MAINNET,
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      18,
      'ETH',
      'Ether'
    ),
    new Token(
      ChainId.MAINNET,
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      6,
      'USDC',
      'USD Coin'
    ),
    new Token(
      ChainId.MAINNET,
      '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
      18,
      'DAI',
      'Dai Stablecoin'
    ),
    new Token(
      ChainId.MAINNET,
      '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      6,
      'USDT',
      'Tether USD'
    ),
  ],
  [ChainId.TESTNET]: [],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
  [ChainId.MAINNET]: {},
};

export default tokens;
