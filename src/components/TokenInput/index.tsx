import styles from "./index.module.css";
import { Input, Select, Tooltip, Typography } from "antd";
import { tokens } from "enums/tokens";
import { getChain } from "utils";
import { FC, useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { getBalance } from "../../services/balances.service";
import { SwapOutlined } from "@ant-design/icons";
export interface ITokenInputProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  fromCurrency: string | undefined;
  setFromCurrency: (v: string) => void;
  toCurrency: string | undefined;
  setToCurrency: (v: string) => void;
  outAmount: number;
  swapNumber?: () => void;
}
const { Option } = Select;
const { Text } = Typography;
const TokenInput: FC<ITokenInputProps> = ({
  inputValue,
  setFromCurrency,
  fromCurrency,
  setInputValue,
  setToCurrency,
  toCurrency,
  outAmount,
  swapNumber,
}) => {
  const { wallet, validNetwork } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (wallet) {
      getBalance(
        wallet,
        tokens[getChain()].filter((item) => item.symbol === fromCurrency)[0]
          .address
      ).then((ret) => {
        // console.log(ret);
        setBalance(Number(ret) || 0);
      });
    }
  }, [wallet, fromCurrency]);
  return (
    <>
      <div className={styles.fromCurrency}>
        <span className={styles.indicator}>FROM</span>
        <Input
          placeholder="0.0"
          style={{ width: 220 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className={styles.fromCurrencySelectContainer}>
          <Select value={fromCurrency} onSelect={setFromCurrency}>
            {tokens[getChain()].map((item) => (
              <Option key={item.symbol} value={item.symbol}>
                {item.name}
              </Option>
            ))}
          </Select>
          <div className={styles.balanceBox}>
            {!wallet ? (
              <span className={styles.balance}>Connect your wallet first</span>
            ) : validNetwork ? (
              <>
                <Text className={styles.balance} ellipsis={true}>
                  Balance:{" "}
                  <Tooltip placement={"bottomLeft"} title={balance}>
                    {balance}
                  </Tooltip>
                </Text>
                <span
                  className={styles.maxSwap}
                  onClick={() => {
                    setInputValue(balance.toString());
                  }}
                >
                  max
                </span>
              </>
            ) : (
              <span className={styles.balance}>Switch the network</span>
            )}
          </div>
        </div>
      </div>
      {swapNumber ? (
        <SwapOutlined
          onClick={swapNumber}
          className={styles.swapBtn}
          rotate={90}
        />
      ) : (
        <div style={{ margin: 10 }} />
      )}
      <div className={styles.toCurrency}>
        <span className={styles.indicator}>TO</span>
        <Input
          placeholder="0.0"
          value={outAmount.toFixed(6)}
          style={{ width: 220, backgroundColor: "transparent", color: "#fff" }}
        />
        <Select
          value={toCurrency}
          onSelect={setToCurrency}
          placeholder={"Select"}
        >
          {tokens[getChain()].map((item) => (
            <Option key={item.symbol} value={item.symbol}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default TokenInput;
