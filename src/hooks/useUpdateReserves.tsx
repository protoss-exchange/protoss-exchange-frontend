import { useState } from "react";
import { getReserveUpdate, PairInfo } from "../services/pool.service";

export const useUpdateReserves = () => {
  const [reserve0, setReserve0] = useState<string>();
  const [reserve1, setReserve1] = useState<string>();
  const [reservePolling, setReservePolling] = useState<any>();
  const [fromCurrency, setFromCurrency] = useState("TOA");
  const [toCurrency, setToCurrency] = useState("TOB");
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
    }, 15000);
    setReservePolling(intervalId);
  };
  return {
    reserve0,
    reserve1,
    setReserve0,
    setReserve1,
    setFromCurrency,
    setToCurrency,
    fromCurrency,
    toCurrency,
    updateReserveValues,
    reservePolling,
  };
};
