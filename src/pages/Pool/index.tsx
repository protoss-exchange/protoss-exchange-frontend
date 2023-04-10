import { useContext, useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { Button, Modal, Table } from "antd";
import styles from "./index.module.css";
import { LiquidityModal } from "components";
import {
  getAllPoolPairs,
  getReserveUpdate,
  PairInfo,
} from "services/pool.service";
import { WalletContext } from "context/WalletContext";
import bigDecimal from "js-big-decimal";
import { hexToDecimalString } from "starknet/utils/number";
import { MyPoolModal } from "../../components/MyPoolModal";
const Pool = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAllPools, setShowAllPools] = useState(true);
  const [fromCurrency, setFromCurrency] = useState("TOA");
  const [toCurrency, setToCurrency] = useState("TOB");
  const [inputValue, setInputValue] = useState("");
  const [outAmount, setOutAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState("0");
  const [pairs, setPairs] = useState<PairInfo[]>([]);
  const [currentViewingPoolDetail, setCurrentViewingPoolDetail] =
    useState<PairInfo | null>(null);
  const [myPoolVisible, setMyPoolVisible] = useState(false);
  const [token0Share, setToken0Share] = useState("0");
  const [token1Share, setToken1Share] = useState("0");
  const { wallet } = useContext(WalletContext);
  useEffect(() => {
    if (wallet) {
      setIsFetching(true);
      getAllPoolPairs(wallet)
        .then((ret) => setPairs(ret))
        .finally(() => setIsFetching(false));
    }
  }, [wallet]);
  const [reserve0, setReserve0] = useState<string>();
  const [reserve1, setReserve1] = useState<string>();
  const [reservePolling, setReservePolling] = useState<any>();

  const updateReserveValues = (pair: PairInfo) => {
    setReserve0(pair.reserve0);
    setReserve1(pair.reserve1);
    setFromCurrency(pair.token0?.symbol || "TOA");
    setToCurrency(pair.token1?.symbol || "TOB");
    if (reservePolling) clearInterval(reservePolling);
    const intervalId = setInterval(() => {
      getReserveUpdate(pair.address).then((ret) => {
        const { reserve0, reserve1 } = ret;
        setReserve0(reserve0);
        setReserve1(reserve1);
      });
    }, 5000);
    setReservePolling(intervalId);
  };

  const onAdd = (pair: PairInfo) => {
    setModalVisible(true);
    updateReserveValues(pair);
  };

  const showMyPool = (pair: PairInfo) => {
    setMyPoolVisible(true);
    setCurrentViewingPoolDetail(pair);
  };

  useEffect(() => {
    if (reserve1 && reserve0) {
      const rate = bigDecimal.divide(
        reserve0.toString(),
        reserve1.toString(),
        6
      );
      setExchangeRate(rate);
      setOutAmount(Number(bigDecimal.multiply(inputValue, rate)));
    }
  }, [inputValue]);
  const calculateMyShare = () => {
    if (!currentViewingPoolDetail) return;
    return bigDecimal.divide(
      bigDecimal.multiply(
        currentViewingPoolDetail.balances,
        Math.pow(10, currentViewingPoolDetail.decimals)
      ),
      hexToDecimalString(currentViewingPoolDetail?.totalSupply),
      currentViewingPoolDetail.decimals
    );
  };

  const calculateEquiv = (reserve: string, decimals: number) => {
    const share = calculateMyShare();
    return bigDecimal.divide(
      bigDecimal.multiply(share, reserve),
      Math.pow(10, decimals),
      6
    );
  };
  const calculateToken0Share = () => {
    if (!currentViewingPoolDetail || !reserve0 || !reserve1) return;
    return calculateEquiv(
      reserve0.toString(),
      currentViewingPoolDetail?.token0?.decimals || 18
    );
  };

  const calculateToken1Share = () => {
    if (!currentViewingPoolDetail || !reserve0 || !reserve1) return;
    return calculateEquiv(
      reserve1.toString(),
      currentViewingPoolDetail?.token1?.decimals || 18
    );
  };

  useEffect(() => {
    setToken0Share(calculateToken0Share() ?? "0");
    setToken1Share(calculateToken1Share() ?? "0");
  }, [reserve0, reserve1, currentViewingPoolDetail]);

  const onLiquidityModalCancel = () => {
    setModalVisible(false);
    clearInterval(reservePolling);
  };

  const onMyPoolModalClose = () => {
    setCurrentViewingPoolDetail(null);
    setMyPoolVisible(false);
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
  const myPoolColumns: ColumnProps<any>[] = [
    {
      key: "name",
      title: "Name",
      width: 200,
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
      key: "detail",
      title: "Detail",
      width: 200,
      align: "center",
      render: (_, record: PairInfo) => (
        <Button
          type="link"
          onClick={() => {
            showMyPool(record);
            updateReserveValues(record);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];
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
      </div>
      {showAllPools ? (
        <Table
          dataSource={pairs}
          columns={columns}
          pagination={false}
          loading={isFetching}
        />
      ) : (
        <Table
          dataSource={pairs.filter((item) => item.balances !== "0")}
          columns={myPoolColumns}
          pagination={false}
          loading={isFetching}
        />
      )}
      <LiquidityModal
        visible={modalVisible}
        onCancel={onLiquidityModalCancel}
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        exchangeRate={exchangeRate}
        setFromCurrency={setFromCurrency}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
      />
      <MyPoolModal
        visible={myPoolVisible}
        onCancel={onMyPoolModalClose}
        poolTokens={currentViewingPoolDetail?.balances || "0"}
        token0Symbol={fromCurrency}
        token1Symbol={toCurrency}
        token0Share={token0Share}
        token1Share={token1Share}
      />
    </div>
  );
};

export default Pool;
