import { Button, Modal } from 'antd';
import { FC } from 'react';
import TokenInput, { ITokenInputProps } from '../TokenInput';

interface ILiquidityModalProps extends ITokenInputProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}
const LiquidityModal: FC<ILiquidityModalProps> = ({
  visible,
  setVisible,
  inputValue,
  setFromCurrency,
  fromCurrency,
  setInputValue,
  setToCurrency,
  toCurrency,
  outAmount,
  swapNumber,
}) => {
  return (
    <Modal
      title={'Add Liquidity'}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TokenInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        setFromCurrency={setFromCurrency}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
        swapNumber={swapNumber}
      />
      <Button
        style={{
          height: 60,
          width: 300,
          borderRadius: 300,
          backgroundColor: '#00c6f3',
          color: 'white',
          fontSize: '20px',
          marginTop: 20,
        }}
      >
        Add Liquidity
      </Button>
    </Modal>
  );
};

export default LiquidityModal;
