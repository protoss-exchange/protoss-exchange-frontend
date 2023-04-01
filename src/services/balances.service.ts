import {Abi, Account, AccountInterface, Contract, Provider} from 'starknet';
import ProtossSwapPairABI from '../abi/protoss_pair_abi.json';
import { defaultProvider } from '../constants';
import { JSBI } from 'protoss-exchange-sdk';
import { uint256ToBN } from 'starknet/utils/uint256';
import { StarknetWindowObject } from 'get-starknet-core';
import {CONTRACT_ADDRESS} from "enums";

export const getBalance = async (
  wallet: StarknetWindowObject,
  address: string
) => {
  const contract = new Contract(
    ProtossSwapPairABI as Abi,
    CONTRACT_ADDRESS,
    defaultProvider
  );
  contract.connect(wallet.account as AccountInterface)
  const ret = await contract.call('balanceOf', [
    wallet?.account?.address.toLocaleLowerCase(),
  ]);
  return JSBI.BigInt(uint256ToBN(ret[0])).toString();
};
