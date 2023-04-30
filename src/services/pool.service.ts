import { Abi, Contract } from "starknet";
import protossPairAbi from "abi/protoss_pair_abi.json";
import protossRouterAbi from "abi/protoss_router_abi.json";
import { defaultProvider } from "../constants";
import { bnToUint256, Uint256, uint256ToBN } from "starknet/utils/uint256";
import { hexToDecimalString, toHex } from "starknet/utils/number";
import { uint256ToReadable } from "utils/maths";
import { getChain } from "utils";
import { StarknetWindowObject } from "get-starknet";
import { JSBI, Token } from "protoss-exchange-sdk";
import tokens from "enums/tokens";
import {
  POOL_API,
  ROUTER_ADDRESSES,
  ROUTER_ADDRESSES_DECIMAL,
} from "enums/address";
import axios from "axios";
import bigDecimal from "js-big-decimal";
export interface PairInfo {
  // name: string,
  address: string;
  totalSupply: string;
  balances?: string;
  decimals: number;
  reserve0: string;
  reserve1: string;
  token0: Token | undefined;
  token1: Token | undefined;
  lastUpdatedTime: string;
  liquidity: number;
}

export interface PairInfoResponse {
  decimals: number;
  lastUpdatedTime: string;
  liquidity: 0;
  pairAddress: string;
  reserve0: string;
  reserve1: string;
  token0: { address: string; decimals: number; name: string; symbol: string };
  token1: { address: string; decimals: number; name: string; symbol: string };
  totalSupply: string;
}
export const getAllPoolPairs = async (): Promise<PairInfo[]> => {
  // let ret: PairInfo[] = [];
  // const contract = new Contract(protossFactoryAbi as Abi, '0x678950106a6e2d23ed2f38b3b645ea48e994a9d009c9aa7f8ef3f8b6434fb5e', defaultProvider);
  // const allPairs = await contract.call('allPairsLength')
  // for(let i = 0; i < 1; i++) {
  //   let pairInfo: PairInfo
  //     const pair = await contract.call('allPairs', [i])
  //     const bn = BigInt(pair.toString())
  //     const pairAddress = `0x${bn.toString(16)}`
  //     const pairContract = new Contract(protossPairAbi as Abi, pairAddress, defaultProvider);
  //     const pairName = await pairContract.call('name');
  //     await sleep(5000);
  //     const pairSymbol = await pairContract.call('symbol');
  //     await sleep(5000);
  //     const {reserve0, reserve1 } = await pairContract.call('getReserves')
  //     await sleep(5000);
  //     const totalSupply = await pairContract.call('totalSupply');
  //     await sleep(5000);
  //     const balance = await pairContract.call('balanceOf', [wallet.account?.address])
  //     await sleep(5000);
  //     const token0 = await pairContract.call('token0');
  //     await sleep(2000);
  //     const token1 = await pairContract.call('token1');
  //     const token0Contract = new Contract(protossErc20Abi as Abi, `0x${uint256ToHex(token0)}`, defaultProvider);
  //     const token1Contract = new Contract(protossErc20Abi as Abi, `0x${uint256ToHex(token1)}`, defaultProvider);
  //     const token0Decimal = await token0Contract.call('decimals');
  //     const token1Decimal = await token1Contract.call('decimals');
  //     console.log('token0Decimal:', token0Decimal.toString(), "token1Decimal", token1Decimal.toString())
  //
  //     // calculate liquidity
  //   const token0Amount = JSBI.divide(JSBI.BigInt(reserve0.toString()), JSBI.BigInt(token0Decimal.toString()))
  //   const token1Amount = JSBI.divide(JSBI.BigInt(reserve1.toString()), JSBI.BigInt(token1Decimal.toString()))
  //   console.log('token0Amount:', token0Amount, "token1Amount:", token1Amount);
  //
  //   pairInfo = {
  //       name: decimalStringToAscii(pairName.toString()),
  //       address: pairAddress,
  //       symbol: decimalStringToAscii(pairSymbol.toString()),
  //       totalSupply: uint256ToReadable(totalSupply[0]),
  //       reserve0: reserve0.toString(),
  //       reserve1: reserve1.toString(),
  //       token0: tokens[getChain()].filter(item => item.address.toLowerCase().includes(uint256ToHex(token0)))[0] ?? undefined,
  //       token1: tokens[getChain()].filter(item => item.address.toLowerCase().includes(uint256ToHex(token1)))[0] ?? undefined,
  //       balances: uint256ToReadable(balance[0])
  //     }
  //     ret.push(pairInfo);
  //     await sleep(10000)
  // }
  // return ret;
  const pairs = await axios.get(POOL_API);
  if (pairs.status === 200) {
    let ret = [];
    for (const item of pairs.data.data ?? []) {
      const token0Address = item.token0.address.substring(2);
      const token1Address = item.token1.address.substring(2);
      ret.push({
        address: item.pairAddress,
        decimals: item.decimals,
        lastUpdatedTime: item.lastUpdatedTime,
        liquidity: item.liquidity,
        reserve0: hexToDecimalString(item.reserve0),
        reserve1: hexToDecimalString(item.reserve1),
        token0:
          tokens[getChain()].filter((item) =>
            item.address.toLowerCase().includes(token0Address)
          )[0] ?? undefined,
        token1:
          tokens[getChain()].filter((item) =>
            item.address.toLowerCase().includes(token1Address)
          )[0] ?? undefined,
        totalSupply: item.totalSupply,
      } as PairInfo);
    }
    return ret;
  }
  return [];
};

export const getPairBalances = async (
  allPairs: PairInfo[],
  wallet: StarknetWindowObject
): Promise<PairInfo[]> => {
  let ret: PairInfo[] = [];
  for (const pair of allPairs) {
    const pairContract = new Contract(
      protossPairAbi as Abi,
      pair.address,
      defaultProvider
    );
    const balances = await pairContract.call("balanceOf", [
      wallet.account?.address,
    ]);
    const bigInt = JSBI.BigInt(uint256ToBN(balances[0]));
    const balance = JSBI.divide(bigInt, JSBI.BigInt("1")).toString();
    const myBalances = bigDecimal.divide(
      balance,
      Math.pow(10, pair.decimals),
      pair.decimals
    );
    if (myBalances !== "0") ret.push({ ...pair, balances: myBalances });
  }
  return ret;
};

export const getReserveUpdate = async (address: string) => {
  const pairContract = new Contract(
    protossPairAbi as Abi,
    address,
    defaultProvider
  );
  const { reserve0, reserve1 } = await pairContract.call("getReserves");
  return { reserve0, reserve1 };
};

export const getQuota = async (
  reserve0: Uint256,
  reserve1: Uint256,
  amountIn: Uint256
) => {
  const routerContract = new Contract(
    protossRouterAbi as Abi,
    ROUTER_ADDRESSES[getChain()],
    defaultProvider
  );
  const ret = await routerContract.call("quote", [
    [amountIn.low, amountIn.high],
    reserve0.toString(),
    reserve1.toString(),
  ]);
  // console.log(uint256ToReadable(ret[0]));
  return uint256ToReadable(ret[0]);
};

export const addLiquidity = async (
  tokenA: Token,
  tokenB: Token,
  amountIn: string | number,
  amountOut: string | number,
  reserve0: any,
  reserve1: any,
  wallet: StarknetWindowObject
) => {
  const uint256Input = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(Number(amountIn), Math.pow(10, tokenA.decimals))
        )
        .toString()
    )
  );
  const uint256Output = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(Number(amountOut), Math.pow(10, tokenB.decimals))
        )
        .toString()
    )
  );
  // TODO: Fix slippage to 1%
  const uint256AmountInMin = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(
            Number(amountIn) * 0.1,
            Math.pow(10, tokenA.decimals)
          )
        )
        .toString()
    )
  );

  const uint256AmountOutMin = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(
            Number(amountOut) * 0.1,
            Math.pow(10, tokenB.decimals)
          )
        )
        .toString()
    )
  );
  wallet.account?.execute([
    {
      entrypoint: "approve",
      contractAddress: tokenA.address,
      calldata: [ROUTER_ADDRESSES[getChain()], 9999999999, 10],
    },
    {
      entrypoint: "approve",
      contractAddress: tokenB.address,
      calldata: [ROUTER_ADDRESSES[getChain()], 9999999999, 10],
    },
    {
      entrypoint: "addLiquidity",
      contractAddress: ROUTER_ADDRESSES_DECIMAL[getChain()],
      calldata: [
        tokenA.address,
        tokenB.address,
        uint256Input.low,
        uint256Input.high,
        uint256Output.low,
        uint256Output.high,
        uint256AmountInMin.low,
        uint256AmountInMin.high,
        uint256AmountOutMin.low,
        uint256AmountOutMin.high,
        wallet.account?.address,
        Math.floor(Date.now() / 1000) + 86400,
      ],
    },
  ]);
};

export const removeLiquidity = (
  tokenA: Token,
  tokenB: Token,
  pairAddress: string,
  liquidity: string,
  amountIn: string | number,
  amountOut: string | number,
  wallet: StarknetWindowObject,
  withdrawSlippage: number,
  decimals = 18
) => {
  const uint256Liquidity = bnToUint256(
    bigDecimal
      .round(bigDecimal.multiply(liquidity, Math.pow(10, decimals)))
      .toString()
  );
  const uint256AmountInMin = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(
            Number(amountIn) * (1 - withdrawSlippage / 100),
            Math.pow(10, tokenA.decimals)
          )
        )
        .toString()
    )
  );
  const uint256AmountOutMin = bnToUint256(
    BigInt(
      bigDecimal
        .round(
          bigDecimal.multiply(
            Number(amountOut) * (1 - withdrawSlippage / 100),
            Math.pow(10, tokenB.decimals)
          )
        )
        .toString()
    )
  );
  const amountApprove = bnToUint256(
    bigDecimal.multiply(99999999999999, Math.pow(10, 18)).toString()
  );
  wallet.account?.execute([
    {
      entrypoint: "approve",
      contractAddress: pairAddress,
      calldata: [
        ROUTER_ADDRESSES[getChain()],
        amountApprove.low,
        amountApprove.high,
      ],
    },
    {
      entrypoint: "removeLiquidity",
      contractAddress: ROUTER_ADDRESSES_DECIMAL[getChain()],
      calldata: [
        tokenA.address,
        tokenB.address,
        uint256Liquidity.low,
        uint256Liquidity.high,
        uint256AmountInMin.low,
        uint256AmountInMin.high,
        uint256AmountOutMin.low,
        uint256AmountOutMin.high,
        wallet.account?.address,
        Math.floor(Date.now() / 1000) + 86400,
      ],
    },
  ]);
};
