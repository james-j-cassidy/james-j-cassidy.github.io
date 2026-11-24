import {
  STACK,
  usageOf,
  type StackCategory,
  type StackItem,
  type StackKind,
  type StackSort,
} from "../../../content/techStack";

// Categories in the order they are grouped.
const CATEGORY_ORDER: readonly StackCategory[] = [
  "language",
  "backend",
  "frontend",
  "desktop",
  "data",
  "cloud",
  "infrastructure",
  "delivery",
  "observability",
  "testing",
  "mobile",
  "realtime",
  "ai",
  "editor",
  "diagramming",
  "assistant",
];

const byName = (a: StackItem, b: StackItem) => a.name.localeCompare(b.name);
const rolesOf = (item: StackItem) => usageOf(item)?.roles ?? 0;
const lastOf = (item: StackItem) => usageOf(item)?.last ?? -1;

// One sub-section's items in the chosen order. Favorites lead whatever the order, once
// James names any; ties fall back to the name.
export function sortStack(kind: StackKind, sort: StackSort): StackItem[] {
  const favorite = (a: StackItem, b: StackItem) =>
    Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
  const compare: Record<StackSort, (a: StackItem, b: StackItem) => number> = {
    roles: (a, b) => rolesOf(b) - rolesOf(a) || byName(a, b),
    recent: (a, b) => lastOf(b) - lastOf(a) || rolesOf(b) - rolesOf(a),
    category: (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
      rolesOf(b) - rolesOf(a) ||
      byName(a, b),
    name: byName,
  };
  return STACK.filter((item) => item.kind === kind).sort(
    (a, b) => favorite(a, b) || compare[sort](a, b),
  );
}
