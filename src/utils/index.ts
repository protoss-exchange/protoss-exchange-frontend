import { toBN } from "starknet/utils/number";
import { ChainId } from "protoss-exchange-sdk";
import tokens from "enums/tokens";
export function isEqualsAddress(addressA: string, addressB: string): boolean {
  return toBN(addressA).eq(toBN(addressB));
}
export function getToken(chainId: ChainId, address: string) {
  return tokens[chainId].find((item) => isEqualsAddress(address, item.address));
}
