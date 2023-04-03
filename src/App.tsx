import React, { lazy, useState } from 'react';
import './App.css';
import { PageLayout } from 'components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Wip from './pages/Wip';
import { WalletContext } from 'context/WalletContext';
import { StarknetWindowObject } from 'get-starknet-core';
import 'antd/dist/reset.css';
const Swap = lazy(() => import('pages/Swap'));
const Pool = lazy(() => import('pages/Pool'));
function App() {
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null);
  return (
    <Router>
      <WalletContext.Provider
        value={{
          wallet,
          setWallet,
        }}
      >
        <Switch>
          <PageLayout>
            <Route path='/' exact component={Wip} />
            {/*<Route path='/' exact component={Swap} />*/}
            {/*<Route path='/pool' exact component={Pool} />*/}
          </PageLayout>
        </Switch>
      </WalletContext.Provider>
    </Router>
  );
}

export default App;
