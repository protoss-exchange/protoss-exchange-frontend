import { useEffect, useState } from 'react';
import { AllPairItem, getAllPairs } from 'services/trade.service';
import { ChainId } from '10k_swap_sdk';
import { ColumnProps } from 'antd/es/table';
import { Button, Table } from 'antd';
import styles from './index.module.css';
import { IPool } from 'enums/types';
import { LiquidityModal } from '../../components';
const Pool = () => {
  const [liquidities, setLiquidities] = useState<IPool[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('ETH');
  const [toCurrency, setToCurrency] = useState('DAI');
  const [inputValue, setInputValue] = useState('');
  const [outAmount, setOutAmount] = useState(0);

  useEffect(() => {
    setIsFetching(true);
    getAllPairs(ChainId.TESTNET).then(ret => {
      setLiquidities(ret);
      setIsFetching(false);
    });
  }, []);

  const onAdd = () => {
    setModalVisible(true);
  };
  const columns: ColumnProps<any>[] = [
    {
      key: 'name',
      title: 'Name',
      width: 200,
      render: (_, record: AllPairItem) => {
        const { token0, token1 } = record;
        return (
          <span>
            {token0.symbol} - {token1.symbol}
          </span>
        );
      },
    },
    {
      key: 'liquidity',
      title: 'Liquidity',
      dataIndex: 'liquidity',
      width: 200,
      align: 'center',
      render: value => <span>$ {value.toFixed(2)}</span>,
    },
    {
      key: 'add',
      title: 'Add',
      width: 200,
      align: 'center',
      render: () => {
        return (
          <Button type='link' onClick={onAdd}>
            Add Liquidity
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      <div className={styles.header}>Pools Overview</div>
      <Table
        dataSource={liquidities}
        columns={columns}
        pagination={false}
        loading={isFetching}
      />
      <LiquidityModal
        visible={modalVisible}
        setVisible={setModalVisible}
        inputValue={inputValue}
        setInputValue={setInputValue}
        fromCurrency={fromCurrency}
        setFromCurrency={setFromCurrency}
        toCurrency={toCurrency}
        setToCurrency={setToCurrency}
        outAmount={outAmount}
      />
    </div>
  );
};

export default Pool;
