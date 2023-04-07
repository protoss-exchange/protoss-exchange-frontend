import { toBN } from "starknet/utils/number";
import { ChainId } from "protoss-exchange-sdk";
import tokens from "enums/tokens";
import { StarknetWindowObject } from "get-starknet";
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

export function confirmNetwork(wallet: StarknetWindowObject) {
  let chainId;
  if (wallet.id.includes("argent")) {
    chainId = wallet.provider?.chainId;
  } else if (wallet.id.includes("braavos")) {
    //@ts-ignore
    chainId = wallet.provider["provider"]?.chainId;
  }
  console.log(chainId)
  if (CHAIN_ID === "TESTNET" && chainId === ChainId.TESTNET) return true;
  return CHAIN_ID === "MAINNET" && chainId === ChainId.MAINNET;
}
export function inCorrectNetwork(network: string) {
  console.log(CHAIN_ID, network.includes('goerli'))
  if (CHAIN_ID === "TESTNET" && network.includes("goerli")) return true;
  return CHAIN_ID === "MAINNET" && network.includes("mainnet");
}

export function targetNetwork() {
  if (CHAIN_ID === "TESTNET") return "Goerli";
  if (CHAIN_ID === "MAINNET") return "Mainnet";
  return "Goerli";
}
