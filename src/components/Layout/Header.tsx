import styles from "./index.module.css";
import { routes } from "routes";
import { useHistory, useLocation } from "react-router-dom";
import { walletService } from "services/wallet.service";
import { useContext, useEffect } from "react";
import { WalletContext } from "context/WalletContext";
export const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const { setWallet, wallet } = useContext(WalletContext);
  const handleConnect = async () => {
    const wallet = await walletService.connectToWallet({
      modalMode: "alwaysAsk",
    });
    setWallet(wallet);
  };
  const handleDisconnect = async () => {
    await walletService.disconnectWallet({ clearLastWallet: true });
    setWallet(null);
  };

  const connectedToPreviousWallet = async () => {
    const ret = await walletService.restorePreviouslyConnectedWallet();
    setWallet(ret);
  };

  useEffect(() => {
    connectedToPreviousWallet();
  }, [wallet]);

  return (
    <div className={styles.header}>
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
      {wallet?.isConnected ? (
        <div className={styles.walletBtn} onClick={handleDisconnect}>
          Disconnect
        </div>
      ) : (
        <div className={styles.walletBtn} onClick={handleConnect}>
          Connect Wallet
        </div>
      )}
    </div>
  );
};
