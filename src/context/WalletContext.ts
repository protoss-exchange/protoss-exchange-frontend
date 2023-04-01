import { createContext } from 'react';
import { StarknetWindowObject } from 'get-starknet-core';
interface WalletContextType {
  wallet: StarknetWindowObject | null;
  setWallet: (wallet: StarknetWindowObject | null) => void;
}
export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
});
