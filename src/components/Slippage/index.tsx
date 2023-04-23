import styles from "./index.module.css";
import { Button, InputNumber, Modal } from "antd";
import { FC, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
interface ISlippage {
  slippage: number;
  setSlippage: (v: number) => void;
}
const Slippage: FC<ISlippage> = (props) => {
  const [slippageAdjustVisible, setSlippageAdjustVisible] = useState(false);
  const { slippage, setSlippage } = props;
  return (
    <>
      <SettingOutlined
        onClick={() => setSlippageAdjustVisible(true)}
        style={{ fontSize: 24, alignSelf: "self-end", color: "#fff" }}
      />
      <Modal
        visible={slippageAdjustVisible}
        onCancel={() => setSlippageAdjustVisible(false)}
        footer={null}
        width={550}
        centered
      >
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          Set Slippage Tolerance:
        </div>
        <div className={styles.slippageContainer}>
          {[0.2, 0.5, 1, 2].map((num) => (
            <Button
              type={slippage === num ? "primary" : "default"}
              onClick={() => setSlippage(num)}
            >
              {num}%
            </Button>
          ))}
          <div className={styles.slippageInput}>
            <InputNumber
              value={slippage}
              onChange={(v) => setSlippage(Number(v))}
              min={0}
              max={100}
              style={{ marginLeft: 12 }}
            />
          </div>
          <div style={{ marginLeft: 20 }}>Current Slippage: {slippage}%</div>
        </div>
      </Modal>
    </>
  );
};
export default Slippage;
