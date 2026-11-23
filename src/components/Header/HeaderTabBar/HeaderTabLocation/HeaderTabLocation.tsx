import styles from "./HeaderTabLocation.module.scss";

interface HeaderTabLocationProps {
  count: number;
  currentIndex: number;
}

// Touch devices only (hidden otherwise by its own styles, keyed to the input type, not
// the screen size): one mark per section, the current one lit and longer, showing where
// the visitor is when swiping through the left-to-right story.
// Visual only: the tabs (aria-current) or the phone's current-section label already tell
// screen readers where they are, so the marks are hidden from them.
function HeaderTabLocation({ count, currentIndex }: HeaderTabLocationProps) {
  return (
    <div className={styles.location} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={styles.mark}
          data-current={index === currentIndex ? "" : undefined}
        />
      ))}
    </div>
  );
}

export default HeaderTabLocation;
