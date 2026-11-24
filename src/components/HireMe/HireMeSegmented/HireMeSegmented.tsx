import styles from "./HireMeSegmented.module.scss";

interface HireMeSegmentedProps<Value extends string> {
  name: string; // the radio group's name, unique in the form
  label: string; // the visible label (the group's legend)
  options: Record<Value, string>;
  value: Value;
  onChange: (value: Value) => void;
}

// A short choice as a segmented control: real radio buttons (arrow keys move between
// them, as the browser does for radios), drawn as one pill with the chosen part lit and
// a check mark, so the choice never rests on color alone.
function HireMeSegmented<Value extends string>({
  name,
  label,
  options,
  value,
  onChange,
}: HireMeSegmentedProps<Value>) {
  return (
    <fieldset className={styles.segmented}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.track}>
        {(Object.keys(options) as Value[]).map((option) => (
          <label key={option} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 10 17 19 7" />
            </svg>
            {options[option]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default HireMeSegmented;
