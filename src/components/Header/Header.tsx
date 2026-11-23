import { useRef } from "react";
import styles from "./Header.module.scss";
import HeaderMainBody from "./HeaderMainBody/HeaderMainBody";
import HeaderTabBar from "./HeaderTabBar/HeaderTabBar";
import HeaderTopBar from "./HeaderTopBar/HeaderTopBar";
import { useHeaderCollapse } from "../../hooks/useHeaderCollapse";
import { useNavigation } from "../../state/navigation";

// The header is fixed to the top. As the visitor scrolls into a section, the main body
// shrinks to a compact row (see useHeaderCollapse) while the top bar stays still and the
// tab bar stays attached under the main body. The parts restyle for the compact row from
// the data-collapsed attribute set here.
// The slot holds the full header's height in the page, so the sections start below it.
function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const { expandedHeight } = useHeaderCollapse(headerRef);
  const collapsed = useNavigation((state) => state.headerCollapsed);

  return (
    <div
      className={styles.slot}
      style={expandedHeight ? { minBlockSize: expandedHeight } : undefined}
    >
      <header
        ref={headerRef}
        className={styles.header}
        data-collapsed={collapsed ? "" : undefined}
      >
        <HeaderTopBar />
        <HeaderMainBody />
        <HeaderTabBar />
      </header>
    </div>
  );
}

export default Header;
