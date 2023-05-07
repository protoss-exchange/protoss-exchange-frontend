import styles from "./index.module.css";
import { Input, Select, Tooltip, Typography } from "antd";
import { tokens } from "enums/tokens";
import { getChain } from "utils";
import { FC, useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { getBalance } from "../../services/balances.service";
import { SwapOutlined } from "@ant-design/icons";
import { ChainId, Token } from "protoss-exchange-sdk";
import { StarknetChainId } from "enums";
export interface ITokenInputProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  fromCurrency: string | undefined;
  setFromCurrency: (v: string) => void;
  toCurrency: string | undefined;
  setToCurrency: (v: string) => void;
  outAmount: string;
  changeOutAmount: (v: string) => void;
  swapNumber?: () => void;
  inputDisable: boolean;
  outputDisable: boolean;
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
  inputDisable,
  outputDisable,
  changeOutAmount,
  swapNumber
}) => {
  const { wallet, validNetwork, allPairs } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  useEffect(() => {
    // let tmpDict = [];
    // for(let i = 0; i < allPairs.length; ++i) {
    //   if (allPairs[i].token0?.address == fromCurrency 
    //     && allPairs[i].token1?.address) {
    //     tmpDict.push(allPairs[i].token1?.address);
    //   }
    //   if (allPairs[i].token1?.address == fromCurrency 
    //     && allPairs[i].token0?.address) {
    //     tmpDict.push(allPairs[i].token0?.address);
    //   }
    // }
    // setToCurrencyDict(tmpDict);
    if (wallet) {
      getBalance(
        wallet,
        tokens[getChain()].find((item) => item.symbol === fromCurrency)
      ).then((ret) => {
        setBalance(Number(ret) || 0);
      });
    }
  }, [wallet, fromCurrency]);


  useEffect(() => {
    if (wallet) {
      getBalance(
        wallet,
        tokens[getChain()].find((item) => item.symbol === toCurrency)
      ).then((ret) => {
        setToBalance(Number(ret) || 0);
      });
    }
  }, [wallet, toCurrency]);


  return (
    <>
      <div className={styles.fromCurrency}>
        <span className={styles.indicator}>FROM</span>
        <Input
          placeholder="0.0"
          disabled={inputDisable}
          style={{ width: 280,backgroundColor: "transparent", overflow:"hidden", whiteSpace:"nowrap",textOverflow:"ellipsis"}}
          value={inputValue}
          className={inputDisable?styles.inputDisable:styles.inputEnable}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <div className={styles.fromCurrencySelectContainer}>
          <Select value={fromCurrency} onSelect={setFromCurrency}>
            {tokens[getChain()].map((item) => (
              <Option
                key={item.symbol}
                value={item.symbol}
                disabled={item.symbol === toCurrency}
              >
                {item.name}
              </Option>
            ))}
          </Select>
          <div className={styles.balanceBox}>
            {!wallet ? (
              <span className={styles.balance}>Connect your wallet</span>
            ) : validNetwork ? (
              <>
                <Text className={styles.balance} ellipsis={true}>
                  Balance:{" "}
                  <Tooltip placement={"bottomLeft"} title={balance}>
                    { !fromCurrency?"-":balance}
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
          value={outAmount}
          disabled={outputDisable}
          className={outputDisable?styles.inputDisable:styles.inputEnable}
          onChange={(e) => {
            changeOutAmount(e.target.value)
          }}
          style={{ width: 280, backgroundColor: "transparent", overflow:"hidden", whiteSpace:"nowrap",textOverflow:"ellipsis"}}
        />
         <div className={styles.fromCurrencySelectContainer}>
        <Select
          style={{width:'141px'}}
          value={toCurrency==""?undefined:toCurrency}
          onSelect={setToCurrency}
          placeholder={"Select Token"}
        >
          {tokens[getChain()].map((item) => (
            <Option
              key={item.symbol}
              value={item.symbol}
              disabled={item.symbol === fromCurrency}
            >
              {item.name}
            </Option>
          ))}
        </Select>
          <div className={styles.balanceBox}>
            {!wallet ? (
              <span className={styles.balance}>Connect your wallet</span>
            ) : validNetwork ? (
                <Text className={styles.balance} ellipsis={true}>
                  Balance:{" "}
                  <Tooltip placement={"bottomLeft"} title={toBalance}>
                    {!toCurrency ? "-":toBalance}
                  </Tooltip>
                </Text>
            ) : (
              <span className={styles.balance}>Switch the network</span>
            )}
          </div>
          </div>
      </div>
    </>
  );
};

export default TokenInput;
