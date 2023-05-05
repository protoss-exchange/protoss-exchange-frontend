import { Token, ChainId } from "protoss-exchange-sdk";
// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const tokens: ChainTokenList = {
  [ChainId.MAINNET]: [
    new Token(
      ChainId.MAINNET,
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      18,
      "ETH",
      "Ether"
    ),
    new Token(
      ChainId.MAINNET,
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      6,
      "USDC",
      "USD Coin"
    ),
    new Token(
      ChainId.MAINNET,
      "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
      18,
      "DAI",
      "Dai Stablecoin"
    ),
    new Token(
      ChainId.MAINNET,
      "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      6,
      "USDT",
      "Tether USD"
    ),
  ],
  [ChainId.TESTNET]: [
    // new Token(
    //   ChainId.TESTNET,
    //   "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    //   18,
    //   "ETH",
    //   "Ether"
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    //   6,
    //   "USDC",
    //   "USD Coin"
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
    //   18,
    //   "DAI",
    //   "Dai Stablecoin"
    // ),
    // new Token(
    //   ChainId.TESTNET,
    //   "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    //   6,
    //   "USDT",
    //   "Tether USD"
    // ),
    new Token(
      ChainId.TESTNET,
      "0x58e4cf84d5c9d7c6e5f3fdd4d2d7186566f39fa67bdd1f24f91c41b4c095fcb",
      18,
      "TOA",
      "Token A"
    ),
    new Token(
      ChainId.TESTNET,
      "0x401d06bd0e3e0d2cca6eead7bb20ec5d6ad4f48a27b2ce00e416f89cbd5d011",
      18,
      "TOB",
      "Token B"
    ),
    new Token(
      ChainId.TESTNET,
      "0x6f5a85cfdadca8a90f7b99c99afd992a149e853a641257db99cf50bc2093ed7",
      18,
      "TOC",
      "Token C"
    ),
    new Token(
      ChainId.TESTNET,
      "0x55ce6e2c9f7e962ceddce755ac5dbed6415d206d5435631557d1d75c44d3149",
      18,
      "TOD",
      "Token D"
    ),
  ],
};

export default tokens;
