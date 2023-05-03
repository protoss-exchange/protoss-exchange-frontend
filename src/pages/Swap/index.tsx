import { onSwapToken, tradeExactIn } from "services/trade.service";
import { tokens } from "enums/tokens";
import { getChain } from "utils";
import { tryParseAmount } from "utils/maths";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { WalletContext } from "context/WalletContext";
import { getBalance } from "services/balances.service";
import styles from "./index.module.css";
import { TokenInput } from "components";
import { SettingOutlined } from "@ant-design/icons";
import Slippage from "../../components/Slippage";
import bigDecimal from "js-big-decimal";

const Swap = () => {
  const [fromCurrency, setFromCurrency] = useState(
    tokens[getChain()][0]?.symbol
  );
  const [toCurrency, setToCurrency] = useState(tokens[getChain()][1]?.symbol);
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [slippageAdjustVisible, setSlippageAdjustVisible] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const { wallet, validNetwork, allPairs } = useContext(WalletContext);
  const [insufficient, setInsufficient] = useState(false);


  const onSwap = async () => {
    if (!fromCurrency || !toCurrency) return;
    setIsFetching(true);
    const inputToken = tokens[getChain()].filter(
      (item) => item.symbol === fromCurrency
    )[0];
    const outputToken = tokens[getChain()].filter(
      (item) => item.symbol === toCurrency
    )[0];
    tradeExactIn(
      tryParseAmount(inputValue, inputToken),
      allPairs,
      outputToken
    ).then((ret) => {
      setOutAmount(Number(ret) || 0);
    });
    if (wallet && validNetwork) {
      const inputBalance = await getBalance(wallet, inputToken);
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
    if (!inputValue.match(/^[0-9]*\.?[0-9]*$/)) {
      setInputInvalid(true);
      return;
    }
    setInputInvalid(false);
    onSwap();
  }, [fromCurrency, toCurrency, inputValue]);


  useEffect(() => {
    if (inputValue) {
      const reserve0 = allPairs[0]['reserve0']
      const reserve1 = allPairs[0]['reserve1']
      const token0 = tokens[getChain()].filter(
        (item) => item.symbol === fromCurrency
      )[0];
      const token1 = tokens[getChain()].filter(
        (item) => item.symbol === toCurrency
      )[0];
      const reserve0WithDecimal = bigDecimal.divide(
        reserve0.toString(),
        Math.pow(10, token0.decimals),
        token0.decimals
      );
      const reserve1WithDecimal = bigDecimal.divide(
        reserve1.toString(),
        Math.pow(10, token1.decimals),
        token1.decimals
      );
      const rate = bigDecimal.divide(
        reserve1WithDecimal,
        reserve0WithDecimal,
        6
      );
      setOutAmount(Number(bigDecimal.multiply(inputValue, rate)));
    }
  }, [inputValue]);

  const generateBtnText = () => {
    if (!wallet?.isConnected) return "Connect Wallet";
    if (!validNetwork) return "Invalid Network";
    if (insufficient) return "Insufficient Balance";
    if (!inputValue) return "Input An Amount";
    if (inputInvalid) return "Input Invalid";
    if (isFetching) return "Calculating...";
    return "Swap";
  };

  const swapToken = () => {
    onSwapToken(
      wallet,
      inputValue,
      outAmount,
      tokens[getChain()].filter((item) => item.symbol === fromCurrency)[0],
      tokens[getChain()].filter((item) => item.symbol === toCurrency)[0],
      slippage
    );
  };

  return (
    <div className={styles.swapContainer}>
      <Slippage slippage={slippage} setSlippage={setSlippage} />
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          onClick={swapToken}
          style={{
            height: 60,
            width: 300,
            borderRadius: 300,
            backgroundColor: "#112545",
            color: "white",
            fontSize: "20px",
            border: "none",
          }}
          disabled={
            !wallet?.isConnected ||
            insufficient ||
            !inputValue ||
            isFetching ||
            inputInvalid ||
            !validNetwork
          }
        >
          {generateBtnText()}
        </Button>
        <div className={styles.swapDetail}>
          <div className={styles.detailInfo}>
            <span>Expected Output</span>
            <span>{outAmount}</span>
          </div>
          <div className={styles.detailInfo}>
            <span>Minimum received after slippage ({slippage}%)</span>
            <span>{(outAmount * (1 - slippage / 100)).toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
