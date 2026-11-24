import LogoMark from "../../../LogoMark/LogoMark";
import styles from "./HeaderLogo.module.scss";

interface HeaderLogoProps {
  homeHref: string;
  label: string;
}

// The home link, wrapping the JC logo (LogoMark).
function HeaderLogo({ homeHref, label }: HeaderLogoProps) {
  return (
    <a className={styles.logo} href={homeHref} aria-label={label}>
      <LogoMark className={styles.mark} />
    </a>
  );
}

export default HeaderLogo;
