import { FC, ReactNode } from 'react';
import styles from './index.module.css';
import { Header } from './Header';
import { GithubOutlined, TwitterCircleFilled } from '@ant-design/icons';
interface Props {
  children: ReactNode;
}
export const PageLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.root}>{children}</div>
      <footer className={styles.footer}>
        <GithubOutlined
          onClick={() =>
            window.open('https://github.com/protoss-exchange', '_blank')
          }
        />
        <TwitterCircleFilled onClick={() => window.open('https://twitter.com/protossdex', '_blank')} />
      </footer>
    </>
  );
};
