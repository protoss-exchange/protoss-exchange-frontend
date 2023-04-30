import { Abi, Account, AccountInterface, Contract, Provider } from "starknet";
import ProtossSwapPairABI from "../abi/protoss_pair_abi.json";
import { defaultProvider } from "../constants";
import { JSBI } from "protoss-exchange-sdk";
import { uint256ToBN } from "starknet/utils/uint256";
import { StarknetWindowObject } from "get-starknet";
import bigDecimal from "js-big-decimal";

export const getBalance = async (
  wallet: StarknetWindowObject,
  address: string
) => {
  const contract = new Contract(
    ProtossSwapPairABI as Abi,
    address,
    defaultProvider
  );
  contract.connect(wallet.account as AccountInterface);
  const ret = await contract.call("balanceOf", [
    wallet?.account?.address.toLocaleLowerCase(),
  ]);
  const bigInt = JSBI.BigInt(uint256ToBN(ret[0]));
  const balance = JSBI.divide(bigInt, JSBI.BigInt("1")).toString();
  return bigDecimal.divide(balance, Math.pow(10, 18), 6)
};
