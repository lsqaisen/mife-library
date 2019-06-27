import styles from './style/index.less';

const Logo = ({ iconSrc, logoSrc }: { iconSrc: string, logoSrc: string }) => {
  return (
    <div className={styles.logoBox}>
      <a className={styles.logo} href="#" onClick={(e) => e.preventDefault()}>
        <img src={iconSrc} alt="Icon" />
        <img src={logoSrc} alt="Logo" />
      </a>
    </div>
  )
}

export default Logo;