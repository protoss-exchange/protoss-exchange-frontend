import { useContext, useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { Button, Table } from "antd";
import styles from "./index.module.css";
import { LiquidityModal } from "components";
import {
  addLiquidity,
  getAllPoolPairs,
  getPairBalances,
  PairInfo,
} from "services/pool.service";
import { WalletContext } from "context/WalletContext";
import bigDecimal from "js-big-decimal";
import { MyPoolItem } from "./MyPoolItem";
import { useUpdateReserves } from "hooks/useUpdateReserves";
import Slippage from "../../components/Slippage";
import { LoadingOutlined } from "@ant-design/icons";
import tokens from "enums/tokens";
import { getChain, isAmountZero } from "utils";
import { Token } from "protoss-exchange-sdk";
import { getBalance } from "services/balances.service";
import ConfirmModal from "components/ConfirmModal";
import PendingModal from "components/PendingModal";
const Pool = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [insufficient, setInsufficient] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAllPools, setShowAllPools] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState("");
  const [myPools, setMyPools] = useState<PairInfo[]>([]);
  const [exchangeRate, setExchangeRate] = useState("0");
  const [withdrawSlippage, setWithdrawSlippage] = useState(1);
  const [resultVisible, setResultVisible] = useState(false);
  const [transactionHash, setTransactionHash] = useState("0x056e6f563f188890d0c3fbbfccb35f3a91c3eba62e7cddef80f5f0cd6514ac89")
  const [curTimeId, setCurTimeId] = useState(0);
  const [pendVisible, setPendVisible] = useState(false);
  const [liquidity, setLiquidity] = useState(false);
  const {
    reserve0,
    reserve1,
    setReserve0,
    setReserve1,
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
    reservePolling,
    updateReserveValues,
  } = useUpdateReserves();
  const { wallet, allPairs, validNetwork, initialFetching } = useContext(WalletContext);
  useEffect(() => {
    if (!wallet) return;
    setIsFetching(true);
    getPairBalances(allPairs, wallet)
      .then((ret) => {
        setMyPools(ret);
      })
      .finally(() => setIsFetching(false));
  }, [showAllPools]);

  const onAdd = (pair: PairInfo) => {
    setModalVisible(true);
    updateReserveValues(pair);
  };

  useEffect(() => {
    if (!reserve0 || !reserve1) {return;}
    if (!inputValue) {setOutAmount("");return;}
    if (!outAmount) {setInputValue("");return;}

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
    setExchangeRate(bigDecimal.divide(
      reserve0WithDecimal,
      reserve1WithDecimal,
      6
    ));
    setOutAmount(bigDecimal.multiply(inputValue, rate));
  }, [reserve0, reserve1]);


  const onLiquidityModalCancel = () => {
    setModalVisible(false);
    clearInterval(reservePolling);
  };

  const columns: ColumnProps<any>[] = [
    {
      key: "name",
      title: "Name",
      width: 200,
      align: "center",
      render: (_, record: PairInfo) => {
        const { token0, token1 } = record;
        return (
          <span>
            {token0?.symbol} - {token1?.symbol}
          </span>
        );
      },
    },
    {
      key: "liquidity",
      dataIndex: "liquidity",
      title: "Liquidity",
      width: 200,
      align: "center",
      render: (_, record: PairInfo) => {
        return (
          <span>
            {bigDecimal.divide(
              record.liquidity,
              Math.pow(10, record.decimals),
              2
            )}
          </span>
        );
      },
    },
    {
      key: "add",
      title: "Add",
      width: 200,
      align: "center",
      render: (_, pair: PairInfo) => {
        return (
          <Button type="link" onClick={() => onAdd(pair)}>
            Add Liquidity
          </Button>
        );
      },
    },
  ];

  const generateMyPoolItems = () => {
    if (!wallet)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <span>Connect your wallet first.</span>
        </div>
      );
    if (initialFetching || isFetching)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <LoadingOutlined style={{ fontSize: 32 }} />
        </div>
      );
    return myPools.map((pair) => (
      <MyPoolItem
        key={pair.address}
        poolTokens={pair?.balances || "0"}
        token0Symbol={pair.token0?.symbol || "TOA"}
        token1Symbol={pair.token1?.symbol || "TOB"}
        onAddLiquidity={() => onAdd(pair)}
        pair={pair}
        withdrawSlippage={withdrawSlippage}
      />
    ));
  };

  const getNewReserve = (isInput:boolean) => {
    if (!reserve0 || !reserve1) {return;}
    
    setIsFetching(true);
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
      reserve0WithDecimal,
      reserve1WithDecimal,
      6
    );
    checkBalance(token0);
    setExchangeRate(rate);

    setIsFetching(false);
    return isInput? bigDecimal.divide(
      reserve1WithDecimal,
      reserve0WithDecimal,
      6
    ):rate;
  }

  const changeOutAmount = (v:string) => {
    setOutAmount(v);
    if (!reserve0 || !reserve1) {return;}
    if (isAmountZero(v)){ setInputValue("");return;}
    const rate = getNewReserve(false);
    
    setInputValue(bigDecimal.multiply(v, rate));
  }

  const changeInputValue = (v:string) => {
    setInputValue(v);
    if (!reserve0 || !reserve1) {return;}
    if (isAmountZero(v)){ setOutAmount("");return; }

    const rate = getNewReserve(true);
    setOutAmount(bigDecimal.multiply(v, rate));
  }

  const checkBalance = async(inputToken: Token) => {
    if (wallet && validNetwork) {
      const inputBalance = await getBalance(wallet, inputToken);
      if (Number(inputBalance) < Number(inputValue)) {
        setInsufficient(true);
      } else setInsufficient(false);
    }
  }

  const onConfirmLiquidityAdd = async() => {
    const token0 = tokens[getChain()].filter(
      (item) => item.symbol === fromCurrency
    )[0];
    const token1 = tokens[getChain()].filter(
      (item) => item.symbol === toCurrency
    )[0];
    if (!token0 || !token1 || !wallet) return;
    let ret = await addLiquidity(
      token0,
      token1,
      inputValue,
      outAmount,
      reserve0,
      reserve1,
      wallet
    );
    console.log("add liqi hash:", ret);

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
    if(!pair||pair.length<1) {setLiquidity(true);return;}

    setReserve0(pair[0].reserve0);
    setReserve1(pair[0].reserve1);
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
    if(!pair||pair.length<1){setLiquidity(true);return;}

    setReserve0(pair[0].reserve0);
    setReserve1(pair[0].reserve1);
  }


  return (
    <div>
       <PendingModal
          visible={pendVisible} 
          transactionHash={transactionHash}
        />
      <div className={styles.header}>Pools Overview</div>
      <div className={styles.poolsBtn}>
        <Button ghost={!showAllPools} onClick={() => setShowAllPools(true)}>
          Pools
        </Button>
        <Button ghost={showAllPools} onClick={() => setShowAllPools(false)}>
          My Pools
        </Button>
        <Slippage
          slippage={withdrawSlippage}
          setSlippage={setWithdrawSlippage}
        />
      </div>
      {showAllPools ? (
        <Table
          dataSource={allPairs}
          columns={columns}
          pagination={false}
          loading={isFetching || initialFetching}
        />
      ) : (
        generateMyPoolItems()
      )}
       <ConfirmModal 
        visible={resultVisible} 
        onCancel={()=>setResultVisible(false)}
        closeBtnClick={()=>setResultVisible(false)}
        transactionHash={transactionHash}
      />
      <LiquidityModal
        visible={modalVisible}
        onCancel={onLiquidityModalCancel}
        inputValue={inputValue}
        setInputValue={changeInputValue}
        fromCurrency={fromCurrency}
        exchangeRate={exchangeRate}
        setFromCurrency={changeFromCurrency}
        reserve0={reserve0}
        reserve1={reserve1}
        toCurrency={toCurrency}
        setToCurrency={changeToCurrency}
        outAmount={outAmount}
        changeOutAmount={changeOutAmount}
        isFetching={isFetching}   
        insufficient={insufficient}
        liquidity={liquidity}
        onConfirmLiquidityAdd={onConfirmLiquidityAdd}
        />
    </div>
  );
};

export default Pool;
