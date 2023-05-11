import React, { lazy, useEffect, useState } from "react";
import "./App.less";
import { PageLayout } from "components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Swap from "pages/Swap";
import Pool from "pages/Pool";
import { WalletContext } from "context/WalletContext";
import { StarknetWindowObject } from "get-starknet";
import { getAllPoolPairs, PairInfo } from "./services/pool.service";
function App() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [validNetwork, setValidNetwork] = useState(false);
  const [allPairs, setAllPairs] = useState<PairInfo[]>([]);
  const [initialFetching, setInitialFetching] = useState(false);
  useEffect(() => {
    setInitialFetching(true);
    getAllPoolPairs()
      .then((ret) => {
        setAllPairs(ret);
      })
      .finally(() => {
        setInitialFetching(false);
      });
  }, []);
  return (
    <Router>
      <WalletContext.Provider
        value={{
          wallet,
          setWallet,
          validNetwork,
          setValidNetwork,
          allPairs,
          setAllPairs,
          initialFetching,
        }}
      >
        <Switch>
          <PageLayout>
            <Route path="/" exact component={Swap} />
            <Route path="/pool" exact component={Pool} />
          </PageLayout>
        </Switch>
      </WalletContext.Provider>
    </Router>
  );
}

export default App;
