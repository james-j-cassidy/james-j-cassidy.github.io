import styles from "./SubTabs.module.scss";

export interface SubTab<Id extends string> {
  id: Id;
  label: string;
  short: string; // phones
  icon: string; // a 24 × 24 stroke path
}

interface SubTabsProps<Id extends string> {
  label: string; // names the navigation
  tabs: readonly SubTab<Id>[];
  current: Id;
  onShow: (id: Id) => void;
}

// A tab's sub-tabs, like the main tabs one level down: the current sub-section is
// marked, and choosing another swaps its whole story in. On phones the shorter names
// show, without icons, so they fit beside a sort on one row (only one name is ever
// displayed, so only one is read).
function SubTabs<Id extends string>({
  label,
  tabs,
  current,
  onShow,
}: SubTabsProps<Id>) {
  return (
    <nav className={styles.chains} aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={styles.chain}
          aria-current={tab.id === current ? "true" : undefined}
          onClick={() => onShow(tab.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={tab.icon} />
          </svg>
          <span className={styles.long}>{tab.label}</span>
          <span className={styles.short}>{tab.short}</span>
        </button>
      ))}
    </nav>
  );
}

export default SubTabs;
