import { Button, Modal } from "antd";
import styles from "./index.module.css";
import { FC } from "react";
interface IMyPoolModal {
  visible: boolean;
  onCancel: () => void;
  poolTokens: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Share: string;
  token1Share: string;
}
export const MyPoolModal: FC<IMyPoolModal> = ({
  visible,
  onCancel,
  poolTokens,
  token0Share,
  token0Symbol,
  token1Share,
  token1Symbol,
}) => {
  return (
    <Modal visible={visible} onCancel={onCancel}>
      <div className={styles.myPoolContainer}>
        <div className={styles.myPoolInfo}>Your Pool Tokens: {poolTokens}</div>
        <div className={styles.myPoolInfo}>
          Equiv. of {token0Symbol}: {token0Share}
        </div>
        <div className={styles.myPoolInfo}>
          Equiv. of {token1Symbol}: {token1Share}
        </div>
        <div className={styles.myPoolOperations}>
          <Button>Add Liquidity</Button>
          <Button>Withdraw</Button>
        </div>
      </div>
    </Modal>
  );
};
