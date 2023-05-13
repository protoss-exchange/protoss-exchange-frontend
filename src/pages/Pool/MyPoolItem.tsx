import { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import { Button } from "antd";
import classNames from "classnames/bind";
import { PairInfo } from "services/pool.service";
import bigDecimal from "js-big-decimal";
import { hexToDecimalString } from "starknet/utils/number";
import { useUpdateReserves } from "hooks/useUpdateReserves";
import Withdraw from "components/Withdraw";
import { getSymbolLogo } from "utils";

const cx = classNames.bind(styles);
interface IMyPoolItem {
  poolTokens: string;
  token0Symbol: string;
  token1Symbol: string;
  onAddLiquidity: () => void;
  pair: PairInfo;
  withdrawSlippage: number;
}

export const MyPoolItem: FC<IMyPoolItem> = ({
  poolTokens,
  token0Symbol,
  token1Symbol,
  onAddLiquidity,
  pair,
  withdrawSlippage,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const { reserve0, reserve1, reservePolling, updateReserveValues } =
    useUpdateReserves();
  const [token0Share, setToken0Share] = useState("0");
  const [token1Share, setToken1Share] = useState("0");
  const calculateMyShare = () => {
    return bigDecimal.divide(
      bigDecimal.multiply(pair.balances, Math.pow(10, pair.decimals)),
      hexToDecimalString(pair?.totalSupply),
      pair.decimals
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
    if (!reserve0 || !reserve1) return;
    return calculateEquiv(reserve0.toString(), pair?.token0?.decimals || 18);
  };

  const calculateToken1Share = () => {
    if (!pair || !reserve0 || !reserve1) return;
    return calculateEquiv(reserve1.toString(), pair?.token1?.decimals || 18);
  };

  const handleExpandBtnClick = () => {
    if (expanded) clearInterval(reservePolling);
    else updateReserveValues(pair);
    setExpanded((prev) => !prev);
  };

  const onWithdraw = () => {
    setWithdrawVisible(true);
  };

  useEffect(() => {
    setToken0Share(calculateToken0Share() ?? "0");
    setToken1Share(calculateToken1Share() ?? "0");
  }, [reserve0, reserve1, expanded]);

  return (
    <div
      className={cx(
        "myPoolItemContainer",
        expanded && "myPoolItemContainerExpanded"
      )}
    >
      <div className={styles.poolSymbol}>
        <div className={styles.poolContainer}>
          <img style={{width:'19px',height:'19px'}} src={getSymbolLogo(token0Symbol)}></img>
          <div style={{width: '5px'}}></div>
          <span>{token0Symbol}</span>
          <div style={{width: '9px'}}></div>
          <span>-</span>
          <div style={{width: '9px'}}></div>
          <img style={{width:'19px',height:'19px'}} src={getSymbolLogo(token1Symbol)}></img>
          <div style={{width: '5px'}}></div>
          <span>{token1Symbol}</span>
        </div>
        <Button onClick={handleExpandBtnClick}>
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      <div className={cx("poolInfoContainer")}>
        <div className={cx("poolInfo")}>
          <div className={cx("myPoolInfo")}>Your Pool Tokens: {poolTokens}</div>
          <div className={cx("myPoolInfo")}>
            Equiv. of {token0Symbol}: {token0Share}
          </div>
          <div className={cx("myPoolInfo")}>
            Equiv. of {token1Symbol}: {token1Share}
          </div>
          <div className={cx("myPoolOperations")}>
            <Button type="primary" onClick={onAddLiquidity}>
              Add Liquidity
            </Button>
            <Button type="primary" onClick={onWithdraw}>
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      <Withdraw
        visible={withdrawVisible}
        setVisible={setWithdrawVisible}
        token0Share={token0Share}
        token1Share={token1Share}
        token0Symbol={token0Symbol}
        token1Symbol={token1Symbol}
        liquidity={poolTokens}
        withdrawSlippage={withdrawSlippage}
      />
    </div>
  );
};
