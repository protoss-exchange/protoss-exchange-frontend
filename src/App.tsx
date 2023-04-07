import React, { lazy, useState } from "react";
import { ConfigProvider } from "antd";
import "./App.less";
import { PageLayout } from "components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Swap from "pages/Swap";
import Pool from "pages/Pool";
import Wip from "./pages/Wip";
import { WalletContext } from "context/WalletContext";
import { StarknetWindowObject } from "get-starknet";
function App() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  const [validNetwork, setValidNetwork] = useState(false);
  return (
    <Router>
      <WalletContext.Provider
        value={{
          wallet,
          setWallet,
          validNetwork,
          setValidNetwork,
        }}
      >
        <Switch>
          <PageLayout>
            {/*<Route path='/' exact component={Wip} />*/}
            <Route path="/" exact component={Swap} />
            <Route path="/pool" exact component={Pool} />
          </PageLayout>
        </Switch>
      </WalletContext.Provider>
    </Router>
  );
}

export default App;
