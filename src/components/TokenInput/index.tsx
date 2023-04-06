import styles from "./index.module.css";
import { Input, Select, Tooltip, Typography } from "antd";
import { tokens } from "enums/tokens";
import { ChainId } from "protoss-exchange-sdk";
import { FC, useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { getBalance } from "../../services/balances.service";
import { SwapOutlined } from "@ant-design/icons";
export interface ITokenInputProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  fromCurrency: string;
  setFromCurrency: (v: string) => void;
  toCurrency: string;
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
  const { wallet } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (wallet) {
      getBalance(
        wallet,
        tokens[ChainId.TESTNET].filter(
          (item) => item.symbol === fromCurrency
        )[0].address
      ).then((ret) => {
        console.log(ret);
        setBalance(Number(ret) || 0);
      });
    }
  }, [wallet, fromCurrency]);
  return (
    <>
      <div className={styles.fromCurrency}>
        <Input
          style={{ width: 220, backgroundColor: "transparent", color: "#fff" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className={styles.fromCurrencySelectContainer}>
          <Select value={fromCurrency} onSelect={setFromCurrency}>
            {tokens[ChainId.TESTNET].map((item) => (
              <Option key={item.symbol} value={item.symbol}>
                {item.name}
              </Option>
            ))}
          </Select>
          <div className={styles.balanceBox}>
            {!wallet ? (
              <span className={styles.balance}>Connect your wallet first</span>
            ) : (
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
        <Input
          value={outAmount.toFixed(6)}
          style={{ width: 220, backgroundColor: "transparent", color: "#fff" }}
        />
        <Select
          value={toCurrency}
          onSelect={setToCurrency}
          placeholder={"Select"}
        >
          {tokens[ChainId.TESTNET].map((item) => (
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
