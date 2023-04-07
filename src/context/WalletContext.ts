import { createContext } from "react";
import { StarknetWindowObject } from "get-starknet";
interface WalletContextType {
  wallet: StarknetWindowObject | null;
  validNetwork: boolean;
  setWallet: (wallet: StarknetWindowObject | null) => void;
  setValidNetwork: (v: boolean) => void;
}
export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  validNetwork: false,
  setWallet: () => {},
  setValidNetwork: () => {},
});
