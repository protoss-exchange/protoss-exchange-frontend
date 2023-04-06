import { StarknetWindowObject } from "get-starknet-core";
import {
  connect,
  ConnectOptions,
  disconnect,
  DisconnectOptions,
} from "get-starknet";
import { STARKNET_WALLET_NAME } from "enums";

class WalletService {
  private _wallet: StarknetWindowObject | null | undefined;
  private _starknet: any;
  constructor() {
    this._wallet = null;
    this._starknet = null;
  }

  async connectToWallet(options?: ConnectOptions) {
    this._wallet = await connect(options);
    if (this._wallet?.name)
      localStorage.setItem(STARKNET_WALLET_NAME, this._wallet?.name);
    return this._wallet;
  }

  async restorePreviouslyConnectedWallet() {
    const previouslyConnected = localStorage.getItem(STARKNET_WALLET_NAME);
    if (!previouslyConnected) return null;
    const wallet = await connect({ modalMode: "neverAsk" });
    if (!wallet?.isConnected) {
      await wallet?.enable({
        starknetVersion: "v4",
      });
    }
    this._wallet = wallet;
    return wallet;
  }

  async disconnectWallet(options?: DisconnectOptions) {
    await disconnect(options);
    localStorage.removeItem(STARKNET_WALLET_NAME);
    this._wallet = null;
    this._starknet = null;
  }

  isConnected() {
    return this._wallet?.isConnected;
  }

  getWallet() {
    if (!this._wallet?.isConnected) return;
    return this._wallet;
  }

  getProvider() {
    if (!this._wallet?.isConnected) return;
    return this._wallet.provider;
  }

  getAccount() {
    if (!this._wallet?.isConnected) return;
    return this._wallet.account;
  }

  getChainId() {
    if (!this._wallet?.isConnected) return;
    return this._wallet.provider.chainId;
  }
}

export const walletService = new WalletService();
