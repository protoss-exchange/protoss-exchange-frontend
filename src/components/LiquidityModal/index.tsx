import { Button, Modal } from "antd";
import { FC, useContext, useState } from "react";
import TokenInput, { ITokenInputProps } from "../TokenInput";
import bigDecimal from "js-big-decimal";
import { addLiquidity } from "../../services/pool.service";
import tokens from "enums/tokens";
import { getChain } from "utils";
import styles from "./index.module.css";
import { WalletContext } from "../../context/WalletContext";

interface ILiquidityModalProps extends ITokenInputProps {
  visible: boolean;
  onCancel: () => void;
  exchangeRate: string;
  reserve0: any;
  reserve1: any;
  isFetching: boolean;
  insufficient: boolean;
  liquidity: boolean;
  onConfirmLiquidityAdd: () => void;
}
const LiquidityModal: FC<ILiquidityModalProps> = ({
  visible,
  onCancel,
  inputValue,
  setFromCurrency,
  fromCurrency,
  setInputValue,
  setToCurrency,
  toCurrency,
  outAmount,
  changeOutAmount,
  inputDisable,
  outputDisable,
  reserve0,
  reserve1,
  liquidity,
  swapNumber,
  exchangeRate,
  isFetching,
  insufficient,
  onConfirmLiquidityAdd,
}) => {
  const { validNetwork, wallet } = useContext(WalletContext);
  // const onConfirmLiquidityAdd = () => {
  //   const token0 = tokens[getChain()].filter(
  //     (item) => item.symbol === fromCurrency
  //   )[0];
  //   const token1 = tokens[getChain()].filter(
  //     (item) => item.symbol === toCurrency
  //   )[0];
  //   if (!token0 || !token1 || !wallet) return;
  //   addLiquidity(
  //     token0,
  //     token1,
  //     inputValue,
  //     outAmount,
  //     reserve0,
  //     reserve1,
  //     wallet
  //   );
  // };

  const generateBtnText = () => {
    if (!wallet?.isConnected) return "Connect Wallet";
    if (!validNetwork) return "Invalid Network";
    if (insufficient) return "Insufficient Balance";
    if (isFetching) return "Calculating...";
    if (liquidity) return "Insufficient Liquidity";
    return "Add Liquidity";
  };

  return (
    <Modal
      centered
      title={"Add Liquidity"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TokenInput
        outputDisable={outputDisable}
        inputDisable={inputDisable}
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        setFromCurrency={setFromCurrency}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
        changeOutAmount={changeOutAmount}
        swapNumber={swapNumber}
      />
      <Button
        onClick={onConfirmLiquidityAdd}
        style={{
          height: 60,
          width: 300,
          borderRadius: 300,
          backgroundColor: "#00c6f3",
          color: "white",
          fontSize: "20px",
          marginTop: 20,
        }}
        disabled={
          !wallet?.isConnected ||
          insufficient ||
          !inputValue ||
          isFetching ||
          !validNetwork
        }
      >
        {generateBtnText()}
      </Button>
      <div className={styles.liquidityInfo}>
        <div className={styles.liquidityInfoItem}>
          <span>{`${fromCurrency} per ${toCurrency}:`}</span>
          <span>{exchangeRate}</span>
        </div>
        <div className={styles.liquidityInfoItem}>
          <span> {`${toCurrency} per ${fromCurrency}:`}</span>
          <span>
            {exchangeRate !== "0" && bigDecimal.divide(1, exchangeRate, 6)}
          </span>
        </div>
        <div className={styles.liquidityInfoItem}>
          <span>Share of Pool:</span>
          <span>0%</span>
        </div>
      </div>
    </Modal>
  );
};

export default LiquidityModal;
