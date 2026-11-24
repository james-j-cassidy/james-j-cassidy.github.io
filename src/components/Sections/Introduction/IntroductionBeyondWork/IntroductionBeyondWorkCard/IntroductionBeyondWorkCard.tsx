import type {
  BeyondWorkIcon,
  BeyondWorkItem,
} from "../../../../../content/introduction";
import UsafSymbol from "../../../../UsafSymbol/UsafSymbol";
import styles from "./IntroductionBeyondWorkCard.module.scss";

interface IntroductionBeyondWorkCardProps {
  id: string;
  labelledBy: string; // the chosen star's tab
  item: BeyondWorkItem;
  number: string; // "Discovery 02"
  change: number; // one more per star chosen; flips the card over to it
}

// The discovery card for the chosen star (the stars' panel): an emblem, the number and
// title, and the story. Each new star flips the card over in 3D to reveal it.
function IntroductionBeyondWorkCard({
  id,
  labelledBy,
  item,
  number,
  change,
}: IntroductionBeyondWorkCardProps) {
  return (
    <section
      id={id}
      className={styles.frame}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div
        key={change}
        className={styles.card}
        data-flipped={change > 0 ? "" : undefined}
      >
        <span className={styles.emblem} aria-hidden="true">
          <Emblem icon={item.icon} />
        </span>
        <div className={styles.text}>
          <p className={styles.number}>{number}</p>
          <h4 className={styles.title}>{item.title}</h4>
          <p className={styles.body}>{item.body}</p>
        </div>
      </div>
    </section>
  );
}

// The item's emblem: the header's Air Force symbol for the veteran item, otherwise a
// line drawing.
function Emblem({ icon }: { icon: BeyondWorkIcon }) {
  if (icon === "usaf") return <UsafSymbol className={styles.usaf} />;
  const paths: Record<Exclude<BeyondWorkIcon, "usaf">, string> = {
    // A compass rose.
    compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM15.5 8.5l-2 5-5 2 2-5Z",
    // A wrench.
    wrench:
      "M14.5 4.5a4 4 0 0 0-5 5L4 15l5 5 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-.5-.5-3Z",
    // An open book.
    book: "M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1ZM12 6.5v13",
    // A heart.
    heart:
      "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z",
  };
  return (
    <svg className={styles.glyph} viewBox="0 0 24 24">
      <path d={paths[icon]} />
    </svg>
  );
}

export default IntroductionBeyondWorkCard;
