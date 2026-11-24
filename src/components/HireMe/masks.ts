import type { ChangeEvent } from "react";

// Field masks for the Hire Me form. Each formats as the visitor types; the caret stays
// after the same digit it followed, so editing in the middle works too.

// Money: digits with thousands separators, and at most two decimals.
export function formatMoney(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  const grouped = whole
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${grouped}.${rest.join("").slice(0, 2)}` : grouped;
}

// Phone: North American numbers as (555) 123-4567, with +1 when it leads; anything
// starting with + (another country) keeps the visitor's own spacing.
export function formatPhone(raw: string): string {
  if (raw.trim().startsWith("+") && !raw.trim().startsWith("+1")) {
    return raw.replace(/[^\d+\s()-]/g, "").slice(0, 20);
  }
  let digits = raw.replace(/\D/g, "");
  const country = digits.length > 10 && digits.startsWith("1");
  if (country) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  const area = digits.slice(0, 3);
  const middle = digits.slice(3, 6);
  const end = digits.slice(6);
  let shaped = area;
  if (digits.length > 3) shaped = `(${area}) ${middle}`;
  if (digits.length > 6) shaped = `(${area}) ${middle}-${end}`;
  return country ? `+1 ${shaped}` : shaped;
}

// Formats an input's value as it changes and keeps the caret after the same digit.
export function masked(
  event: ChangeEvent<HTMLInputElement>,
  format: (raw: string) => string,
): string {
  const input = event.target;
  const caret = input.selectionStart ?? input.value.length;
  const digitsBefore = input.value
    .slice(0, caret)
    .replace(/[^\d.]/g, "").length;
  const value = format(input.value);
  requestAnimationFrame(() => {
    let seen = 0;
    let position = 0;
    while (position < value.length && seen < digitsBefore) {
      if (/[\d.]/.test(value[position])) seen += 1;
      position += 1;
    }
    input.setSelectionRange(position, position);
  });
  return value;
}
