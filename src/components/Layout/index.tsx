import { FC, ReactNode } from "react";
import styles from "./index.module.css";
import { Header } from "./Header";
import { GithubOutlined, TwitterCircleFilled } from "@ant-design/icons";
import discord from "assets/discord.png";
import telegram from "assets/telegram.png";
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
            window.open("https://github.com/protoss-exchange", "_blank")
          }
        />
        <TwitterCircleFilled
          onClick={() =>
            window.open("https://twitter.com/protossdex", "_blank")
          }
        />
        <a href="https://discord.gg/8nufdtrUq2" target="_blank">
          <img alt={"discord"} width={24} src={discord} style={{marginLeft:'12px'}}/>
        </a>
        <a href="https://t.me/ProtossDEX" target="_blank">
          <img alt={"telegram"} width={24} src={telegram} style={{marginLeft:'12px'}}/>
        </a>
      </footer>
    </>
  );
};
