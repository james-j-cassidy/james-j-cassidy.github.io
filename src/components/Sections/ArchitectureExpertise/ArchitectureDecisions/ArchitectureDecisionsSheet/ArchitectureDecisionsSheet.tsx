import type {
  ARCHITECTURE_DECISIONS,
  DecisionRecord,
  DecisionScore,
} from "../../../../../content/architectureExpertise";
import styles from "./ArchitectureDecisionsSheet.module.scss";

type SheetLabels = Omit<
  typeof ARCHITECTURE_DECISIONS,
  "tag" | "intro" | "records" | "recordsLabel"
>;

interface ArchitectureDecisionsSheetProps {
  id: string;
  labelledBy: string; // the chosen record's tab
  record: DecisionRecord;
  change: number; // one more per record chosen; rescans the sheet
  labels: SheetLabels;
}

const BARS: Record<DecisionScore, number> = { strong: 3, fair: 2, weak: 1 };

// One decision record (the tabs' panel) on a blueprint sheet: its context, the options
// weighed against the same criteria, the decision and what it costs. Each score is a
// meter of up to three bars with its word, never color alone; the chosen option is
// marked in words too.
function ArchitectureDecisionsSheet({
  id,
  labelledBy,
  record,
  change,
  labels,
}: ArchitectureDecisionsSheetProps) {
  return (
    <section
      id={id}
      className={styles.sheet}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div
        key={change}
        className={styles.content}
        data-scanned={change > 0 ? "" : undefined}
      >
        <div className={styles.header}>
          <p className={styles.number}>{record.number}</p>
          <p className={styles.stamp}>{labels.status}</p>
        </div>
        <h4 className={styles.title}>{record.title}</h4>
        <div className={styles.context}>
          <p className={styles.label}>{labels.contextLabel}</p>
          <p className={styles.text}>{record.context}</p>
        </div>
        <table className={styles.table}>
          <caption className={styles.caption}>{labels.optionsLabel}</caption>
          <thead>
            <tr>
              <th scope="col">{labels.optionLabel}</th>
              {record.criteria.map((criterion) => (
                <th key={criterion} scope="col">
                  {criterion}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {record.options.map((option) => (
              <tr
                key={option.name}
                data-chosen={option.chosen ? "" : undefined}
              >
                <th scope="row">
                  {option.name}
                  {option.chosen && (
                    <span className={styles.chosen}>
                      {" "}
                      <span aria-hidden="true">✓</span>{" "}
                      <span className={styles.chosenWord}>
                        {labels.chosenLabel}
                      </span>
                    </span>
                  )}
                </th>
                {option.scores.map((score, column) => (
                  <td key={record.criteria[column]}>
                    <span className={styles.meter} aria-hidden="true">
                      {[1, 2, 3].map((bar) => (
                        <span
                          key={bar}
                          className={styles.bar}
                          data-on={bar <= BARS[score] ? "" : undefined}
                        />
                      ))}
                    </span>
                    <span className={styles.score}>{labels.scores[score]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.outcome}>
          <div className={styles.decision}>
            <p className={styles.label}>{labels.decisionLabel}</p>
            <p className={styles.text}>{record.decision}</p>
          </div>
          <div className={styles.consequences}>
            <p className={styles.label}>{labels.gainsLabel}</p>
            <ul className={styles.list} data-kind="gain">
              {record.gains.map((gain) => (
                <li key={gain}>{gain}</li>
              ))}
            </ul>
            <p className={styles.label}>{labels.costsLabel}</p>
            <ul className={styles.list} data-kind="cost">
              {record.costs.map((cost) => (
                <li key={cost}>{cost}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureDecisionsSheet;
