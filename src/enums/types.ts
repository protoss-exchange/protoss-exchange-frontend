import { Pair, Token, TokenAmount } from '10k_swap_sdk';

export interface IResponse<T> {
  data: T;
  errCode: number;
  errMessage: string;
}

export interface IPool {
  token0: Token;
  token1: Token;
  pair: Pair;
  totalSupply: TokenAmount;
  pairAddress: string;
  decimals: number;
  reserve0: string;
  reserve1: string;
  APR: number;
  liquidity: number;
}
