import { useCallback, useState } from 'react';

const Quote = () => {
  const [outputAmount, setOutputAmount] = useState<string>();
  const onQuote = useCallback(async () => {}, []);
  return <div className='App'></div>;
};

export default Quote;
