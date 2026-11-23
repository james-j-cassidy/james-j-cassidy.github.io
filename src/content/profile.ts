// Header profile content (English). Kept out of components so translations can replace it per language.
export interface Profile {
  name: string;
  portraitAlt: string;
  title: string;
  // icon "usaf" shows the Air Force symbol before the text.
  highlights: readonly { text: string; icon?: "usaf" }[];
  // Each group renders on its own line, as in the mock.
  skillGroups: readonly (readonly string[])[];
}

export const PROFILE: Profile = {
  name: "James Joseph Cassidy",
  portraitAlt: "Portrait of James Joseph Cassidy",
  title: "Software Engineer & Technical Leader",
  highlights: [{ text: "25+ Years" }, { text: "USAF Veteran", icon: "usaf" }],
  skillGroups: [
    [".NET", "C#", "Azure", "React", "PostgreSQL"],
    ["Platform Architecture", "Legacy Modernization"],
    ["AI-Assisted Development"],
  ],
};
