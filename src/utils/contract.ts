import { ChainId } from 'protoss-exchange-sdk';
import { AccountInterface, ProviderInterface, Contract, Abi } from 'starknet';
import { ROUTER_ADDRESSES } from 'enums/address';

export function getRouterContract(
  chainId: ChainId,
  library: ProviderInterface | AccountInterface
) {
  // return new Contract(l0k_router_abi as Abi, ROUTER_ADDRESSES[chainId], library)
}
