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

// Phone: North American numbers as (555) 123-4567, with +1 when there are 11 digits
// and the first is 1; anything
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
  // The parenthesis opens with the first digit, so the typed text always matches the
  // start of the visible template.
  let shaped = digits ? `(${area}` : "";
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

// The visible part of a mask: the template still to fill, shown faint around what has
// been typed. `before` sits ahead of the typed text, `after` follows it.
export interface MaskGhost {
  before: string;
  after: string;
}

const PHONE_TEMPLATE = "(___) ___-____";

// Phone fills left to right, so the rest of the template follows what is typed. A
// number from another country (starting with + but not +1) has no template.
export function phoneGhost(value: string): MaskGhost {
  if (value.startsWith("+") && !value.startsWith("+1")) {
    return { before: "", after: "" };
  }
  const template = value.startsWith("+1")
    ? `+1 ${PHONE_TEMPLATE}`
    : PHONE_TEMPLATE;
  return { before: "", after: template.slice(value.length) };
}

// Money fills from the right like a till: the whole part is grouped from the right, so
// the faint zeros ahead of it line up with the template's separators; cents (hourly
// only) follow the typed text.
export function moneyGhost(value: string, template: string): MaskGhost {
  const [templateWhole, templateCents] = template.split(".");
  const [whole, cents] = value.split(".");
  const before = templateWhole.slice(
    0,
    Math.max(0, templateWhole.length - whole.length),
  );
  let after = "";
  if (templateCents !== undefined) {
    after =
      cents === undefined
        ? `.${templateCents}`
        : templateCents.slice(cents.length);
  }
  return { before, after };
}
