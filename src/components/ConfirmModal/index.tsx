import { Button, Modal } from "antd";
import { FC, useContext, useState } from "react";
import styles from "./index.module.css";
import { WalletContext } from "../../context/WalletContext";
import openInBrowser from '../../assets/openInBrowser.svg'
import { getStarkscanLink } from "utils";
import { ArrowUp } from 'react-feather'

interface IConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  transactionHash: string;
  closeBtnClick: () => void;
}
const ConfirmModal: FC<IConfirmModalProps> = ({
  visible,
  onCancel,
  closeBtnClick,
  transactionHash,
}) => {
  const { validNetwork, wallet } = useContext(WalletContext);
  
  return (
    <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={550}
        centered
      >
        <div>
        <div style={{height:'18px'}}></div>
          <div style={{display:'flex',gap:'10px', justifyContent:'center', alignContent:'center'}}>
            <ArrowUp strokeWidth={1} size={90} color={'white'} />
          </div>
          <div style={{height:'38px'}}></div>
          <div style={{ fontSize: 24, fontWeight: 700, textAlign: 'center'}}>
            Transcation Submitted
          </div>
          <div style={{height:'11px'}}></div>
          <div className={styles.slippageContainer}>
          {transactionHash && (
            <a style={{display:'flex', gap:'10px', justifyContent:'center', alignContent:'center'}}
              href={getStarkscanLink(transactionHash, 'transaction')} target="_blank"
            >
              <img src={openInBrowser} alt="open" />
                  <text
                    fontWeight={500}
                    fontSize={14}
                    color={'white'}
                    fontFamily={'DM Sans'}
                    letterSpacing={'0px'}
                  >
                    Open in browser
                  </text>
            </a>
          )}
          </div>
          <div style={{height:'58px'}}></div>
          <div style={{display:'flex',gap:'10px', justifyContent:'center', alignContent:'center'}}>
            <Button
              onClick={closeBtnClick}
              style={{
                height: 60,
                width: 300,
                borderRadius: 300,
                backgroundColor: "#112545",
                color: "white",
                fontSize: "20px",
                border: "none",
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
  );
};

export default ConfirmModal;
