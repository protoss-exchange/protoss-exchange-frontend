import { FC, ReactNode } from 'react';
import styles from './index.module.css';
import { Header } from './Header';
interface Props {
  children: ReactNode;
}
export const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.root}>{children}</div>
    </>
  );
};
