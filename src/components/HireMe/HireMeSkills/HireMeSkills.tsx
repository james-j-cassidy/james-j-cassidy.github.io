import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { HIRE_ME_LABELS } from "../../../content/hireMe";
import { STACK, TECH_STACK_LABELS } from "../../../content/techStack";
import styles from "./HireMeSkills.module.scss";

interface HireMeSkillsProps {
  step: string; // its number in the form, "04"
  chosen: readonly string[]; // ids from James's stack, in the needed list
  others: readonly string[]; // names outside it, in the needed list
  onToggle: (id: string) => void;
  onAddOther: (name: string) => void;
  onRemoveOther: (name: string) => void;
}

// Where focus goes after a move: the item now at the same place in the list it left,
// so a keyboard user can keep moving skills one after another.
type FocusAfter = { list: "pool" | "needed"; index: number } | null;

// The skills the role needs, as two lists: James's skills (the pool, filterable, in
// two groups) and the skills needed for the role. Each skill moves from one to the
// other with one press. Skills James doesn't list are added straight to the needed
// list and marked as outside his stack (in words, not only by look).
function HireMeSkills({
  step,
  chosen,
  others,
  onToggle,
  onAddOther,
  onRemoveOther,
}: HireMeSkillsProps) {
  const L = HIRE_ME_LABELS;
  const filterId = useId();
  const otherId = useId();
  const otherHintId = useId();
  const poolHeadingId = useId();
  const neededHeadingId = useId();
  const [filter, setFilter] = useState("");
  const [draft, setDraft] = useState("");
  const focusAfter = useRef<FocusAfter>(null);
  const poolRef = useRef<HTMLUListElement>(null);
  const neededRef = useRef<HTMLUListElement>(null);

  const pool = STACK.filter(
    (item) =>
      !chosen.includes(item.id) &&
      item.name.toLowerCase().includes(filter.trim().toLowerCase()),
  );
  const needed = [
    ...STACK.filter((item) => chosen.includes(item.id)).map((item) => ({
      key: item.id,
      name: item.name,
      outside: false,
    })),
    ...others.map((name) => ({ key: `other-${name}`, name, outside: true })),
  ];

  // After the move has rendered.
  useEffect(() => {
    const after = focusAfter.current;
    if (!after) return;
    focusAfter.current = null;
    const list = after.list === "pool" ? poolRef : neededRef;
    const buttons = list.current?.querySelectorAll("button");
    const target = buttons?.[Math.min(after.index, buttons.length - 1)];
    (target ?? list.current)?.focus();
  });

  function moveIn(id: string, index: number) {
    onToggle(id);
    focusAfter.current = { list: "pool", index };
  }

  function moveOut(key: string, index: number) {
    if (key.startsWith("other-")) onRemoveOther(key.slice("other-".length));
    else onToggle(key);
    focusAfter.current = { list: "needed", index };
  }

  function add() {
    const name = draft.trim();
    if (!name) return;
    // A skill that is in James's stack moves over from the pool instead.
    const known = STACK.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    if (known) {
      if (!chosen.includes(known.id)) onToggle(known.id);
    } else if (
      !others.some((other) => other.toLowerCase() === name.toLowerCase())
    ) {
      onAddOther(name);
    }
    setDraft("");
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    add();
  }

  return (
    <fieldset className={styles.skills}>
      <legend className={styles.legend}>
        <span className={styles.stepNumber} aria-hidden="true">
          {step}
        </span>
        {L.steps[3]}
      </legend>
      <p className={styles.hint}>{L.skillsHint}</p>
      <div className={styles.lists}>
        <section className={styles.list} aria-labelledby={poolHeadingId}>
          <h3 id={poolHeadingId} className={styles.listTitle}>
            {L.poolLabel}
          </h3>
          <label className={styles.fieldLabel} htmlFor={filterId}>
            {L.filter}
          </label>
          <input
            id={filterId}
            className={styles.input}
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className={styles.scroller}>
            <ul ref={poolRef} className={styles.items} tabIndex={-1}>
              {(["technologies", "tools"] as const).map((kind) => {
                const items = pool.filter((item) => item.kind === kind);
                if (items.length === 0) return null;
                return (
                  <li key={kind} className={styles.groupItem}>
                    <p className={styles.groupLabel}>
                      {TECH_STACK_LABELS.kinds[kind]}
                    </p>
                    <ul className={styles.items}>
                      {items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={styles.item}
                            aria-label={L.moveIn(item.name)}
                            onClick={() => moveIn(item.id, pool.indexOf(item))}
                          >
                            <span>{item.name}</span>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            {pool.length === 0 && <p className={styles.hint}>{L.noMatches}</p>}
          </div>
        </section>

        <section className={styles.list} aria-labelledby={neededHeadingId}>
          <h3 id={neededHeadingId} className={styles.listTitle}>
            {L.neededLabel}{" "}
            <span className={styles.count}>({needed.length})</span>
          </h3>
          <label className={styles.fieldLabel} htmlFor={otherId}>
            {L.otherLabel}
          </label>
          <div className={styles.addRow}>
            <input
              id={otherId}
              className={styles.input}
              type="text"
              value={draft}
              aria-describedby={otherHintId}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKey}
            />
            <button type="button" className={styles.add} onClick={add}>
              {L.add}
            </button>
          </div>
          <p id={otherHintId} className={styles.hint}>
            {L.otherHint}
          </p>
          <div className={styles.scroller}>
            <ul ref={neededRef} className={styles.items} tabIndex={-1}>
              {needed.map((skill, index) => (
                <li key={skill.key}>
                  <button
                    type="button"
                    className={styles.item}
                    data-outside={skill.outside ? "" : undefined}
                    aria-label={`${L.moveOut(skill.name)}${skill.outside ? ` (${L.outsideTag})` : ""}`}
                    onClick={() => moveOut(skill.key, index)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 12H5M11 6l-6 6 6 6" />
                    </svg>
                    <span className={styles.itemText}>
                      <span>{skill.name}</span>
                      {skill.outside && (
                        <span className={styles.outsideTag}>
                          {L.outsideTag}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {needed.length === 0 && (
              <p className={styles.hint}>{L.neededEmpty}</p>
            )}
          </div>
        </section>
      </div>
    </fieldset>
  );
}

export default HireMeSkills;
