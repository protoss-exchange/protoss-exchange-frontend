import { ChainId } from "protoss-exchange-sdk";
import { AccountInterface, ProviderInterface, Contract, Abi } from "starknet";

export function getRouterContract(
  chainId: ChainId,
  library: ProviderInterface | AccountInterface
) {
  // return new Contract(l0k_router_abi as Abi, ROUTER_ADDRESSES[chainId], library)
}
