import { createContext } from "react";
import { StarknetWindowObject } from "get-starknet";
import { PairInfo } from "../services/pool.service";
interface WalletContextType {
  wallet: StarknetWindowObject | null;
  validNetwork: boolean;
  setWallet: (wallet: StarknetWindowObject | null) => void;
  setValidNetwork: (v: boolean) => void;
  allPairs: PairInfo[];
  setAllPairs: (v: PairInfo[]) => void;
  initialFetching: boolean;
}
export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  validNetwork: false,
  setWallet: () => {},
  setValidNetwork: () => {},
  allPairs: [],
  setAllPairs: () => {},
  initialFetching: false,
});
