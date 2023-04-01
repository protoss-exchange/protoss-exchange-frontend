import { tradeExactIn } from 'services/trade.service';
import { tokens } from 'enums/tokens';
import { ChainId } from 'protoss-exchange-sdk';
import { tryParseAmount } from 'utils/maths';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { WalletContext } from 'context/WalletContext';
import { getBalance } from 'services/balances.service';
import styles from './index.module.css';
import { TokenInput } from 'components';

const Swap = () => {
  const [fromCurrency, setFromCurrency] = useState('ETH');
  const [toCurrency, setToCurrency] = useState('DAI');
  const [inputValue, setInputValue] = useState('');
  const [outAmount, setOutAmount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { wallet } = useContext(WalletContext);
  const [insufficient, setInsufficient] = useState(false);
  const onSwap = async () => {
    setIsFetching(true);
    const inputToken = tokens[ChainId.TESTNET].filter(
      item => item.symbol === fromCurrency
    )[0];
    const outputToken = tokens[ChainId.TESTNET].filter(
      item => item.symbol === toCurrency
    )[0];

    tradeExactIn(tryParseAmount(inputValue, inputToken), outputToken).then(
      ret => {
        const outAmount = ret?.outputAmount.toSignificant(10);
        setOutAmount(Number(outAmount) || 0);
      }
    );
    if (wallet) {
      const inputBalance = await getBalance(wallet, inputToken.address);
      if (Number(inputBalance) < Number(inputValue)) {
        setInsufficient(true);
      } else setInsufficient(false);
    }
    setIsFetching(false);
  };
  const swapNumber = () => {
    setInputValue(outAmount.toString());
    const tmp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tmp);
  };

  useEffect(() => {
    onSwap();
  }, [fromCurrency, toCurrency, inputValue]);
  const generateBtnText = () => {
    if (!wallet?.isConnected) return 'Connect Wallet';
    if (insufficient) return 'Insufficient Balance';
    if (!inputValue) return 'Input An Amount';
    if (isFetching) return 'Calculating...';
    return 'Transfer';
  };
  return (
    <div className={styles.swapContainer}>
      <TokenInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        setFromCurrency={setFromCurrency}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
        swapNumber={swapNumber}
      />
      <div>
        <Button
          onClick={() => alert('Tx Start')}
          style={{
            height: 60,
            width: 300,
            borderRadius: 300,
            backgroundColor: '#0070f3',
            color: 'white',
            fontSize: '20px',
          }}
          disabled={
            !wallet?.isConnected || insufficient || !inputValue || isFetching
          }
        >
          {generateBtnText()}
        </Button>
      </div>
    </div>
  );
};

export default Swap;
