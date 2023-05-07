import { onSwapToken, tradeExactIn } from "services/trade.service";
import { tokens } from "enums/tokens";
import { getChain, getStarkscanLink, isAmountZero } from "utils";
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
import { Token } from "protoss-exchange-sdk";
import ConfirmModal from "components/ConfirmModal";
import PendingModal from "components/PendingModal";


const Swap = () => {
  const [fromCurrency, setFromCurrency] = useState(
    tokens[getChain()][0]?.symbol
  );
  const [toCurrency, setToCurrency] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [slippageAdjustVisible, setSlippageAdjustVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [pendVisible, setPendVisible] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const [outputDisable, setOutputDisable] = useState(false);
  const [transactionHash, setTransactionHash] = useState("0x056e6f563f188890d0c3fbbfccb35f3a91c3eba62e7cddef80f5f0cd6514ac89")
  const { wallet, validNetwork, allPairs } = useContext(WalletContext);
  const [insufficient, setInsufficient] = useState(false);
  const [liquidity, setLiquidity] = useState(false);
  const [curTimeId, setCurTimeId] = useState(0);

  const checkBalance = async(inputToken: Token) => {
    if (wallet && validNetwork) {
      const inputBalance = await getBalance(wallet, inputToken);
      if (Number(inputBalance) < Number(inputValue)) {
        setInsufficient(true);
      } else setInsufficient(false);
    }
  }

  const onSwap = async () => {
    if (!fromCurrency || !toCurrency) return;
    setIsFetching(true);
    setInputDisable(true);
    setOutputDisable(true);

    if (isAmountZero(inputValue) && !isAmountZero(outAmount)) {
      const inputToken = tokens[getChain()].filter(
        (item) => item.symbol === fromCurrency
      )[0];
      const outputToken = tokens[getChain()].filter(
        (item) => item.symbol === toCurrency
      )[0];
      const newOut = Number(outAmount).toFixed(outputToken.decimals);
      tradeExactIn(
        tryParseAmount(newOut, outputToken),
        allPairs,
        inputToken
      ).then((ret) => {
        setIsFetching(false);
        setInputDisable(false);
        setOutputDisable(false);
        if (ret) setInputValue(ret);
      }).catch((err) => {
        setIsFetching(false);
        setInputDisable(false);
        setOutputDisable(false);
      });
      checkBalance(inputToken);
    }else {
      const inputToken = tokens[getChain()].filter(
        (item) => item.symbol === fromCurrency
      )[0];
      const outputToken = tokens[getChain()].filter(
        (item) => item.symbol === toCurrency
      )[0];
      const newInput = Number(inputValue).toFixed(inputToken.decimals);
      tradeExactIn(
        tryParseAmount(newInput, inputToken),
        allPairs,
        outputToken
      ).then((ret) => {
        setIsFetching(false);
        setInputDisable(false);
        setOutputDisable(false);
        if (ret) setOutAmount(ret);
      }).catch((err) => {
        setIsFetching(false);
        setInputDisable(false);
        setOutputDisable(false);
      });
      checkBalance(inputToken);
    }
    
  };
  const swapNumber = () => {
    setInputValue(outAmount);
    const tmp = fromCurrency?fromCurrency:"";
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
  }, [fromCurrency, toCurrency]);

  const generateBtnText = () => {
    if (!wallet?.isConnected) return "Connect Wallet";
    if (!validNetwork) return "Invalid Network";
    if (insufficient) return "Insufficient Balance";
    if (!inputValue) return "Input An Amount";
    if (inputInvalid) return "Input Invalid";
    if (isFetching) return "Calculating...";
    if (liquidity) return "Insufficient Liquidity";
    return "Swap";
  };

  const swapToken = async() => {
    const ret = await onSwapToken(
      wallet,
      inputValue,
      Number(outAmount),
      tokens[getChain()].filter((item) => item.symbol === fromCurrency)[0],
      tokens[getChain()].filter((item) => item.symbol === toCurrency)[0],
      slippage
    );
    console.log("get tx info:", ret);
    if (ret && ret.hasOwnProperty('transaction_hash')) {
      if (curTimeId>0) clearTimeout(curTimeId);
      setResultVisible(true);
      setTransactionHash(ret['transaction_hash']);
      setPendVisible(true);
      const tmpId = setTimeout(()=>{
        setPendVisible(false);
      }, 12000);
      setCurTimeId(Number(tmpId));
    }
  };

  const changeInputValue = (v:string) => {
    setInputValue(v);
    if (!fromCurrency || !toCurrency) return;
    if (isAmountZero(v)){setOutAmount("");return;}
    
    setIsFetching(true);
    setOutputDisable(true);
    const inputToken = tokens[getChain()].filter(
      (item) => item.symbol === fromCurrency
    )[0];
    const outputToken = tokens[getChain()].filter(
      (item) => item.symbol === toCurrency
    )[0];
    const newInput = Number(v).toFixed(inputToken.decimals);
    tradeExactIn(
      tryParseAmount(newInput, inputToken),
      allPairs,
      outputToken
    ).then((ret) => {
      setIsFetching(false);
      setOutputDisable(false);
      if (ret) setOutAmount(ret);
    }).catch((err)=>{
      console.log("input amount err:", err)
      setIsFetching(false);
      setOutputDisable(false);
    });
    
    checkBalance(inputToken);
  }

  const changeOutAmount = (v:string) => {
    setOutAmount(v);
    if (!fromCurrency || !toCurrency) return;
    if (isAmountZero(v)){ setInputValue(""); return;}
    
    setIsFetching(true);
    setInputDisable(true);
    const inputToken = tokens[getChain()].filter(
      (item) => item.symbol === fromCurrency
    )[0];
    const outputToken = tokens[getChain()].filter(
      (item) => item.symbol === toCurrency
    )[0];
    const newOut = Number(v).toFixed(outputToken.decimals);
    tradeExactIn(
      tryParseAmount(newOut, outputToken),
      allPairs,
      inputToken
    ).then((ret) => {
      setIsFetching(false);
      setInputDisable(false);
      if (ret) setInputValue(ret);
    }).catch((err) => {
      console.log("out amount err:", err)
      setIsFetching(false);
      setInputDisable(false);
    });
    
    checkBalance(inputToken);
  }

  const changeFromCurrency = (v:string) => {
    setLiquidity(false)
    setFromCurrency(v);
    const pair = allPairs.filter((item) => {
      if ((v == item.token0?.symbol 
        && toCurrency == item.token1?.symbol) ||
        (v == item.token1?.symbol 
          && toCurrency == item.token0?.symbol)) {
        return true;
      }
    });
    if(!pair||pair.length<1) setLiquidity(true);
  }

  const changeToCurrency = (v:string) => {
    setLiquidity(false)
    setToCurrency(v);
    const pair = allPairs.filter((item) => {
      if ((v == item.token0?.symbol 
        && fromCurrency == item.token1?.symbol) ||
        (v == item.token1?.symbol 
          && fromCurrency == item.token0?.symbol)) {
        return true;
      }
    });
    if(!pair||pair.length<1) setLiquidity(true);
  }


  return (
    <div>
      <PendingModal
          visible={pendVisible} 
          transactionHash={transactionHash}
        />
      <div className={styles.swapContainer}>
        <Slippage slippage={slippage} setSlippage={setSlippage} />
        <ConfirmModal 
          visible={resultVisible} 
          onCancel={()=>setResultVisible(false)}
          closeBtnClick={()=>setResultVisible(false)}
          transactionHash={transactionHash}
        />
        <TokenInput
          outputDisable={outputDisable}
          inputDisable={inputDisable}
          inputValue={inputValue}
          setInputValue={changeInputValue}
          fromCurrency={fromCurrency}
          setFromCurrency={changeFromCurrency}
          toCurrency={toCurrency}
          setToCurrency={changeToCurrency}
          outAmount={outAmount}
          changeOutAmount={changeOutAmount}
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
              <span>{(Number(outAmount) * (1 - slippage / 100)).toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Swap;
