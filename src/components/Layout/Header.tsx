import styles from "./index.module.css";
import { routes } from "routes";
import { useHistory, useLocation } from "react-router-dom";
import { walletService } from "services/wallet.service";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "context/WalletContext";
import { confirmNetwork, inCorrectNetwork, targetNetwork } from "utils";
import logo from "assets/logo192.png";

export const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const { setWallet, wallet, validNetwork, setValidNetwork } =
    useContext(WalletContext);
  const [walletAddress, setWalletAddress] = useState("");
  const handleConnect = async () => {
    const wallet = await walletService.connectToWallet({
      modalMode: "alwaysAsk",
    });
    if (!wallet) return;
    setWallet(wallet);
  };
  const handleDisconnect = async () => {
    await walletService.disconnectWallet({ clearLastWallet: true });
    setWallet(null);
  };

  const connectedToPreviousWallet = async () => {
    const ret = await walletService.restorePreviouslyConnectedWallet();
    if (!ret) return;
    setWallet(ret);
  };

  useEffect(() => {
    connectedToPreviousWallet();
    if (!wallet) return;
    setWalletAddress(walletAddress);
    walletService.onAccountChange((walletAddress) => {
      setWalletAddress(walletAddress);
    });
    setValidNetwork(confirmNetwork(wallet));
    walletService.onNetworkChange((network) => {
      walletService.connectToWallet({ modalMode: "neverAsk" });
      if (inCorrectNetwork(network)) {
        setValidNetwork(true);
      } else {
        setValidNetwork(false);
      }
    });
  }, [wallet]);
  const walletStatus = () => {
    if (!wallet?.isConnected)
      return (
        <div className={styles.walletBtn} onClick={handleConnect}>
          Connect Wallet
        </div>
      );
    else if (!validNetwork)
      return (
        <div style={{ position: "relative" }}>
          <div className={styles.wrongNet} onClick={handleDisconnect}>
            Wrong Network
          </div>
          <div className={styles.wrongNetTip}>
            Please switch to {targetNetwork()}
          </div>
        </div>
      );
    else
      return (
        <div className={styles.walletBtn} onClick={handleDisconnect}>
          Disconnect
        </div>
      );
  };
  return (
    <div className={styles.header}>
      <img alt={"logo"} width={64} src={logo} />
      <div className={styles.nav}>
        {routes.map((route) => (
          <div
            onClick={() => history.push(route.path)}
            key={route.path}
            className={
              location.pathname === route.path
                ? styles.headerItemSelected
                : styles.headerItem
            }
          >
            {route.name}
          </div>
        ))}
      </div>
      {walletStatus()}
    </div>
  );
};
