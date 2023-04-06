import { tradeExactIn } from "services/trade.service";
import { tokens } from "enums/tokens";
import { ChainId } from "protoss-exchange-sdk";
import { tryParseAmount } from "utils/maths";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { WalletContext } from "context/WalletContext";
import { getBalance } from "services/balances.service";
import styles from "./index.module.css";
import { TokenInput } from "components";
import { onSwapToken } from "services/trade.service";
import { SettingOutlined } from "@ant-design/icons";

const Swap = () => {
  const [fromCurrency, setFromCurrency] = useState("TOA");
  const [toCurrency, setToCurrency] = useState("TOC");
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [slippageAdjustVisible, setSlippageAdjustVisible] = useState(false);
  const { wallet } = useContext(WalletContext);
  const [insufficient, setInsufficient] = useState(false);
  const onSwap = async () => {
    setIsFetching(true);
    const inputToken = tokens[ChainId.TESTNET].filter(
      (item) => item.symbol === fromCurrency
    )[0];
    const outputToken = tokens[ChainId.TESTNET].filter(
      (item) => item.symbol === toCurrency
    )[0];

    tradeExactIn(tryParseAmount(inputValue, inputToken), outputToken).then(
      (ret) => {
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
    if (!wallet?.isConnected) return "Connect Wallet";
    if (insufficient) return "Insufficient Balance";
    if (!inputValue) return "Input An Amount";
    if (isFetching) return "Calculating...";
    return "Transfer";
  };

  const swapToken = () => {
    onSwapToken(
      wallet,
      inputValue,
      outAmount,
      tokens[ChainId.TESTNET].filter((item) => item.symbol === fromCurrency)[0],
      tokens[ChainId.TESTNET].filter((item) => item.symbol === toCurrency)[0],
      slippage
    );
  };

  return (
    <div className={styles.swapContainer}>
      <SettingOutlined
        onClick={() => setSlippageAdjustVisible(true)}
        style={{ fontSize: 24, alignSelf: "self-end", color: "#fff" }}
      />
      <Modal
        visible={slippageAdjustVisible}
        onCancel={() => setSlippageAdjustVisible(false)}
        footer={null}
      >
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          Set Slippage Tolerance:
        </div>
        <div className={styles.slippageContainer}>
          {[0.2, 0.5, 1, 2].map((num) => (
            <Button
              type={slippage === num ? "primary" : "default"}
              onClick={() => setSlippage(num)}
            >
              {num}%
            </Button>
          ))}
          <div style={{ marginLeft: 20 }}>Current Slippage: {slippage}%</div>
        </div>
      </Modal>
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
            !wallet?.isConnected || insufficient || !inputValue || isFetching
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
