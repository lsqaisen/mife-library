import styles from './style/index.less';

export default () => {
  return (
    <div className={styles.loader}>
      <div className={styles.shadow}></div>
      <div className={styles.box}></div>
    </div>
  )
};