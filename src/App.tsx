import React, { lazy, useState } from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import { PageLayout } from "components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Swap from "pages/Swap";
import Pool from "pages/Pool";
import Wip from "./pages/Wip";
import { WalletContext } from "context/WalletContext";
import { StarknetWindowObject } from "get-starknet-core";
import "antd/dist/reset.css";
function App() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Fira Code", monospace;',
        },
      }}
    >
      <Router>
        <WalletContext.Provider
          value={{
            wallet,
            setWallet,
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
    </ConfigProvider>
  );
}

export default App;
