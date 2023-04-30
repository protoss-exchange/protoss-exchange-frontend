import { useContext, useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { Button, Table } from "antd";
import styles from "./index.module.css";
import { LiquidityModal } from "components";
import {
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
import { getChain } from "utils";
const Pool = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAllPools, setShowAllPools] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState(0);
  const [myPools, setMyPools] = useState<PairInfo[]>([]);
  const [exchangeRate, setExchangeRate] = useState("0");
  const [withdrawSlippage, setWithdrawSlippage] = useState(1);
  const {
    reserve0,
    reserve1,
    fromCurrency,
    toCurrency,
    setFromCurrency,
    setToCurrency,
    reservePolling,
    updateReserveValues,
  } = useUpdateReserves();
  const { wallet, allPairs, initialFetching } = useContext(WalletContext);
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
    if (reserve1 && reserve0) {
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
      setExchangeRate(rate);
      setOutAmount(Number(bigDecimal.multiply(inputValue, rate)));
    }
  }, [inputValue, reserve0, reserve1]);

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
  return (
    <div>
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
      <LiquidityModal
        visible={modalVisible}
        onCancel={onLiquidityModalCancel}
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        exchangeRate={exchangeRate}
        setFromCurrency={setFromCurrency}
        reserve0={reserve0}
        reserve1={reserve1}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
      />
    </div>
  );
};

export default Pool;
