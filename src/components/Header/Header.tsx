import styles from "./Header.module.scss";
import HeaderMainBody from "./HeaderMainBody/HeaderMainBody";
import HeaderTabBar from "./HeaderTabBar/HeaderTabBar";
import HeaderTopBar from "./HeaderTopBar/HeaderTopBar";

function Header() {
  return (
    <header className={styles.header}>
      <HeaderTopBar />
      <HeaderMainBody />
      <HeaderTabBar />
    </header>
  );
}

export default Header;
