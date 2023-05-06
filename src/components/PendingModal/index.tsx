import { FC, useContext, useState } from "react";
import styles from "./index.module.css";
import { WalletContext } from "../../context/WalletContext";
import openInBrowser from '../../assets/openInBrowser.svg'
import { getStarkscanLink } from "utils";

interface IPendingModalProps {
  visible: boolean;
  transactionHash: string;
}
const PendingModal: FC<IPendingModalProps> = ({
  visible,
  transactionHash,
}) => {
  const { validNetwork, wallet } = useContext(WalletContext);
  
  return visible?(
    <div
        className={styles.container}
      >
        <div>
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
                    Pending
                  </text>
            </a>
          )}
          </div>
        </div>
      </div>
  ):(<div></div>);
};

export default PendingModal;
