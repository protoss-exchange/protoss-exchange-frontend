import { Modal } from "antd";
import { FC, useContext, useState } from "react";
import styles from "./index.module.css";
import classnames from "classnames/bind";
import { Slider } from "antd";
import bigDecimal from "js-big-decimal";
import { removeLiquidity } from "services/pool.service";
import tokens from "enums/tokens";
import { getChain } from "utils";
import { WalletContext } from "context/WalletContext";
import { getPairAddress } from "protoss-exchange-sdk";

const cx = classnames.bind(styles);
const marks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};
interface IWithdraw {
  visible: boolean;
  setVisible: (v: boolean) => void;
  token0Share: string;
  token1Share: string;
  token0Symbol: string;
  token1Symbol: string;
  liquidity: string;
}
const Withdraw: FC<IWithdraw> = (props) => {
  const {
    visible,
    setVisible,
    token0Share,
    token1Share,
    token0Symbol,
    token1Symbol,
    liquidity,
  } = props;
  const { wallet } = useContext(WalletContext);
  const [token0Withdrawn, setToken0Withdrawn] = useState(
    bigDecimal.multiply(token0Share, 0.25)
  );
  const [token1Withdrawn, setToken1Withdrawn] = useState(
    bigDecimal.multiply(token1Share, 0.25)
  );
  const onWithdrawAmountChanged = (ratio: number) => {
    setToken0Withdrawn(bigDecimal.multiply(token0Share, ratio / 100));
    setToken1Withdrawn(bigDecimal.multiply(token1Share, ratio / 100));
  };

  const onRemoveLiquidity = () => {
    const token0 = tokens[getChain()].filter(
      (item) => item.symbol === token0Symbol
    )[0];
    const token1 = tokens[getChain()].filter(
      (item) => item.symbol === token1Symbol
    )[0];
    if (!token0 || !token1 || !wallet) return;
    removeLiquidity(
      token0,
      token1,
      getPairAddress(token0, token1),
      liquidity,
      token0Withdrawn,
      token1Withdrawn,
      wallet
    );
  };
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      centered
      onOk={() => onRemoveLiquidity()}
    >
      Withdraw your share.
      <Slider
        onChange={onWithdrawAmountChanged}
        marks={marks}
        step={1}
        defaultValue={25}
      />
      <div>
        Withdraw of {token0Symbol}: {token0Withdrawn}
        <br />
        Withdraw of {token1Symbol}: {token1Withdrawn}
      </div>
    </Modal>
  );
};

export default Withdraw;
