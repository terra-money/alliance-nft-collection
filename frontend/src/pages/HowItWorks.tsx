import { default as Content } from 'content/HowItWorks.mdx';
import styles from "./HowitWorks.module.scss";

export const HowItWorks = () => {
  return (
    <div className={styles.container}>
      <Content />
    </div>
  );
};
