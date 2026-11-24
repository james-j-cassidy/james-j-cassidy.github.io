import {
  useRef,
  type InputHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { MaskGhost } from "../masks";
import styles from "./HireMeMaskedInput.module.scss";

interface HireMeMaskedInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "className" | "size" | "type"
> {
  type?: "text" | "tel";
  value: string;
  ghost: MaskGhost; // the template still to fill, shown faint around the value
  lead?: ReactNode; // shown first, e.g. the currency sign
  trail?: ReactNode; // shown last, e.g. "/ year"
  size?: "base" | "large";
  invalid?: boolean;
}

// A text field with a visible mask: the template stays on screen, faint, and fills in
// as the visitor types. The input grows with its text (a hidden copy of the value sizes
// it), so the faint parts sit right against what was typed. The template is drawn
// for sighted visitors only; the field's hint says the format in words. A click
// anywhere in the field puts the caret at the end of the text.
function HireMeMaskedInput({
  type = "text",
  value,
  ghost,
  lead,
  trail,
  size = "base",
  invalid = false,
  ...input
}: HireMeMaskedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput(event: PointerEvent<HTMLDivElement>) {
    const field = inputRef.current;
    if (!field || event.target === field) return;
    event.preventDefault();
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  }

  return (
    <div
      className={styles.field}
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      onPointerDown={focusInput}
    >
      {lead}
      <span className={styles.text}>
        <span className={styles.ghost} aria-hidden="true">
          {ghost.before}
        </span>
        <span className={styles.grow}>
          <span className={styles.mirror} aria-hidden="true">
            {value}
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type={type}
            size={1} // no default width of its own; the hidden copy sizes it
            aria-invalid={invalid || undefined}
            value={value}
            {...input}
          />
        </span>
        <span className={styles.ghost} aria-hidden="true">
          {ghost.after}
        </span>
      </span>
      {trail && <span className={styles.trail}>{trail}</span>}
    </div>
  );
}

export default HireMeMaskedInput;
