import {
  ChainId,
  JSBI,
  Pair,
  Percent,
  Token,
  TokenAmount,
  Trade,
} from "protoss-exchange-sdk";
import bigDecimal from "js-big-decimal";
import ProtossSwapPairABI from "abi/protoss_pair_abi.json";
import ProtossERC20ABI from "abi/protoss_erc20_abi.json";
import ProtossRouterABI from "abi/protoss_router_abi.json";
import { Contract, Abi } from "starknet";
import { defaultProvider } from "../constants";
import { IResponse } from "enums/types";
import {
  DECIMAL,
  ROUTER_ADDRESS,
  ROUTER_ADDRESS_DECIMAL,
  SERVER_URLS,
} from "enums";
import axios from "axios";
import { getToken } from "../utils";
import { bnToUint256 } from "starknet/utils/uint256";
import { StarknetWindowObject } from "get-starknet";
import { PairInfo } from "./pool.service";

export interface AllPairItem {
  token0: {
    address: string;
    decimals: number;
    name: string | undefined;
    symbol: string;
  };
  token1: {
    address: string;
    decimals: number;
    name: string | undefined;
    symbol: string;
  };
  liquidity: number;
  pairAddress: string;
  totalSupply: string; //0x
  decimals: number;
  reserve0: string; //0x
  reserve1: string; //0x
  APR: number;
}

export const allCommonPairs = (currencyA: Token, currencyB: Token) => {
  const tokens = [[currencyA, currencyB]];
  const pairAddresses = tokens.map(([tokenA, tokenB]) => {
    return tokenA && tokenB && !tokenA.equals(tokenB)
      ? Pair.getAddress(tokenA, tokenB)
      : undefined;
  });
  const pairContracts = pairAddresses.map((address) =>
    address
      ? new Contract(ProtossSwapPairABI as Abi, address, defaultProvider)
      : undefined
  );
  const [token0, token1] = currencyA.sortsBefore(currencyB)
    ? [currencyA, currencyB]
    : [currencyB, currencyA];
};

export const tradeExactIn = async (
  currencyAAmount: TokenAmount | undefined,
  allPairs: PairInfo[],
  currencyB: Token
): Promise<string | null> => {
  if (!currencyAAmount) return null;
  const currencyA = currencyAAmount.token;
  let swapToken = false;
  const address = allPairs.filter((item) => {
    if (
      item.token1?.address === currencyA.address &&
      item.token0?.address === currencyB.address
    ) {
      swapToken = true;
      return true;
    }
    if (
      item.token0?.address === currencyA.address &&
      item.token1?.address === currencyB.address
    ) {
      return true;
    }
  })[0].address;
  const contract = new Contract(
    ProtossSwapPairABI as Abi,
    address,
    defaultProvider
  );
  const { reserve0, reserve1 } = await contract.call("getReserves");
  // const possiblePairs = [
  //   new Pair(
  //     new TokenAmount(currencyA, reserve0.toString()),
  //     new TokenAmount(currencyB, reserve1.toString())
  //   ),
  // ];
  // return Trade.bestTradeExactIn(possiblePairs, currencyAAmount, currencyB, {
  //   maxHops: 3,
  //   maxNumResults: 1,
  // })[0];
  return swapToken
    ? bigDecimal.multiply(
        bigDecimal.divide(reserve0.toString(), reserve1.toString(), 6),
        currencyAAmount.toFixed(currencyB.decimals)
      )
    : bigDecimal.multiply(
        bigDecimal.divide(reserve1.toString(), reserve0.toString(), 6),
        currencyAAmount.toFixed(currencyA.decimals)
      );
};

export async function getAllPairs(chainId: ChainId) {
  try {
    const res = await axios.get<IResponse<AllPairItem[]>>(
      `${SERVER_URLS[chainId]}/pool/pairs`
    );
    if (res.data.errCode === 0) {
      const data = res.data.data;
      // console.log(data);
      return data
        .filter((item) => {
          return !!(
            getToken(chainId, item.token0.address) &&
            getToken(chainId, item.token1.address)
          );
        })
        .map((item) => {
          const { reserve0, reserve1, totalSupply } = item;
          const token0 = getToken(chainId, item.token0.address) as Token;
          const token1 = getToken(chainId, item.token1.address) as Token;
          const pair = new Pair(
            new TokenAmount(token0, reserve0),
            new TokenAmount(token1, reserve1)
          );

          return {
            ...item,
            token0,
            token1,
            pair,
            totalSupply: new TokenAmount(pair.liquidityToken, totalSupply),
          };
        });
    }

    throw new Error("fetch pairs fail");
  } catch (error: any) {
    throw new Error(error);
  }
}

export const onSwapToken = async (
  wallet: StarknetWindowObject | null,
  amountIn: string | number,
  amountOutMin: string | number,
  fromCurrency: Token,
  toCurrency: Token,
  slippage: number | undefined
) => {
  const amountInNum = Number(amountIn);
  const amountOutMinNum = Number(amountOutMin);
  const uint256Input = bnToUint256(
    BigInt(bigDecimal.multiply(Number(amountInNum), DECIMAL).toString())
  );
  const uint256Output = bnToUint256(
    BigInt(bigDecimal.multiply(Number(amountOutMinNum), DECIMAL).toString())
  );
  let minimumOut;
  if (!wallet) return;
  if (slippage) {
    minimumOut = amountOutMinNum * (1 - slippage / 100);
  }
  const contract = new Contract(
    ProtossERC20ABI as Abi,
    fromCurrency.address,
    defaultProvider
  );
  const ret = await contract.call("allowance", [
    wallet.account?.address,
    ROUTER_ADDRESS,
  ]);
  if (minimumOut && minimumOut > amountOutMinNum) return;
  const uint256MinimunOut = bnToUint256(
    BigInt(bigDecimal.multiply(minimumOut, DECIMAL).toString())
  );
  const ret2 = await wallet.account?.execute(
    [
      {
        entrypoint: "approve",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        contractAddress: fromCurrency.address,
        calldata: [ROUTER_ADDRESS, 10000, 10],
      },
      {
        entrypoint: "swapExactTokensForTokens",
        contractAddress: ROUTER_ADDRESS_DECIMAL,
        calldata: [
          uint256Input.low,
          uint256Input.high,
          uint256MinimunOut.low,
          uint256MinimunOut.high,
          "2",
          fromCurrency.address,
          toCurrency.address,
          wallet.account?.address,
          Math.floor(Date.now() / 1000) + 86400,
        ],
      },
    ],
    [ProtossERC20ABI as Abi, ProtossRouterABI as Abi],
    { maxFee: 17390000 }
  );
  // console.log(ret2);
};
