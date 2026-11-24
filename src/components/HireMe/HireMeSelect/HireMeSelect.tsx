import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./HireMeSelect.module.scss";

export interface SelectOption<Value extends string> {
  value: Value;
  label: string; // what is read and shown in the list
  mark?: string; // a short sign shown first, e.g. "$"
}

interface HireMeSelectProps<Value extends string> {
  label: string;
  options: readonly SelectOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
}

// A drop-down drawn to match the form, built on the ARIA select-only combobox pattern:
// a button that names the choice, opening a list of options. Keyboard: Down, Up, Enter
// or Space open it; in the list the arrows, Home and End move, typing a letter jumps
// to an option, Enter or Space chooses, Escape closes without choosing and Tab closes
// keeping the choice. Pointer: click to open and choose; a click elsewhere closes it.
function HireMeSelect<Value extends string>({
  label,
  options,
  value,
  onChange,
}: HireMeSelectProps<Value>) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = options[selectedIndex];

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function show() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
      PageDown: last,
      PageUp: 0,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      // Closes the list only, not the dialog around it.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "Tab") {
      onChange(options[active].value);
      setOpen(false);
    } else if (event.key.length === 1) {
      const letter = event.key.toLowerCase();
      const next = options.findIndex(
        (option, index) =>
          index > active && option.label.toLowerCase().startsWith(letter),
      );
      const wrap = options.findIndex((option) =>
        option.label.toLowerCase().startsWith(letter),
      );
      if (next >= 0 || wrap >= 0) setActive(next >= 0 ? next : wrap);
    }
  }

  return (
    <div ref={rootRef} className={styles.select}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        className={styles.button}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={handleKey}
      >
        {selected.mark && (
          <span className={styles.mark} aria-hidden="true">
            {selected.mark}
          </span>
        )}
        <span className={styles.value}>{selected.label}</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <ul
        id={listId}
        className={styles.list}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!open}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            className={styles.option}
            aria-selected={option.value === value}
            data-active={index === active ? "" : undefined}
            onPointerEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option.mark && (
              <span className={styles.mark} aria-hidden="true">
                {option.mark}
              </span>
            )}
            <span>{option.label}</span>
            <svg className={styles.tick} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 10 17 19 7" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HireMeSelect;
