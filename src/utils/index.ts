import { toBN } from "starknet/utils/number";
import { ChainId, Token } from "protoss-exchange-sdk";
import tokens from "enums/tokens";
import { StarknetWindowObject } from "get-starknet";
import { PairInfo } from "../services/pool.service";
const { REACT_APP_CHAIN_ID: CHAIN_ID } = process.env;
export function isEqualsAddress(addressA: string, addressB: string): boolean {
  return toBN(addressA).eq(toBN(addressB));
}
export function getToken(chainId: ChainId, address: string) {
  return tokens[chainId].find((item) => isEqualsAddress(address, item.address));
}

export function getChain() {
  if (!CHAIN_ID) return ChainId.TESTNET;
  if (CHAIN_ID === "MAINNET") return ChainId.MAINNET;
  if (CHAIN_ID === "TESTNET") return ChainId.TESTNET;
  return ChainId.TESTNET;
}

export function getNetwork() {
  if (!CHAIN_ID) return "goerli-alpha";
  if (CHAIN_ID === "MAINNET") return "mainnet-alpha";
  if (CHAIN_ID === "TESTNET") return "goerli-alpha";
  return "goerli-alpha";
}

export function confirmNetwork(wallet: StarknetWindowObject) {
  let chainId;
  if (wallet.id.includes("argent")) {
    chainId = wallet.provider?.chainId;
  } else if (wallet.id.includes("braavos")) {
    //@ts-ignore
    chainId = wallet.provider["provider"]?.chainId;
  }
  if (CHAIN_ID === "TESTNET" && chainId === ChainId.TESTNET) return true;
  return CHAIN_ID === "MAINNET" && chainId === ChainId.MAINNET;
}
export function inCorrectNetwork(network: string) {
  if (CHAIN_ID === "TESTNET" && network.includes("goerli")) return true;
  return CHAIN_ID === "MAINNET" && network.includes("mainnet");
}

export function targetNetwork() {
  if (CHAIN_ID === "TESTNET") return "Goerli";
  if (CHAIN_ID === "MAINNET") return "Mainnet";
  return "Goerli";
}

export function decimalStringToAscii(decimal: string) {
  const bn = BigInt(decimal);
  let str = "";
  const bnHex = bn.toString(16);
  for (let i = 0; i < bnHex.length; i += 2) {
    const code = parseInt(bnHex.substring(i, i + 2), 16);
    str += String.fromCharCode(code);
  }
  return str;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPairAddress(
  allPairs: PairInfo[],
  token0: Token,
  token1: Token
) {
  return (
    allPairs.filter(
      (item) =>
        item.token0?.address === token0.address &&
        item.token1?.address === token1.address
    )[0].address ?? ""
  );
}
