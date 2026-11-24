import type {
  Credential,
  CredentialLevel,
  CredentialSort,
} from "../../../../content/professionalJourney";

// Degrees from the highest down, then certifications.
const LEVEL_RANK: Record<CredentialLevel, number> = {
  master: 0,
  bachelor: 1,
  associate: 2,
  certification: 3,
};

// A credential not yet dated counts as the earliest.
const dateOf = (credential: Credential) => credential.awarded ?? "0000-00";

// The credentials in the chosen order. Ties fall back to importance.
export function sortCredentials(
  credentials: readonly Credential[],
  sort: CredentialSort,
): Credential[] {
  const byImportance = (a: Credential, b: Credential) =>
    a.importance - b.importance;
  const compare: Record<
    CredentialSort,
    (a: Credential, b: Credential) => number
  > = {
    importance: byImportance,
    newest: (a, b) => dateOf(b).localeCompare(dateOf(a)) || byImportance(a, b),
    oldest: (a, b) => dateOf(a).localeCompare(dateOf(b)) || byImportance(a, b),
    type: (a, b) =>
      LEVEL_RANK[a.level] - LEVEL_RANK[b.level] ||
      dateOf(b).localeCompare(dateOf(a)) ||
      byImportance(a, b),
  };
  return [...credentials].sort(compare[sort]);
}

// "March 2014" from "2014-03"; null when the date is not known.
export function formatAwarded(
  awarded: string | null,
  months: readonly string[],
): string | null {
  if (!awarded) return null;
  const [year, month] = awarded.split("-").map(Number);
  return `${months[month - 1]} ${year}`;
}
