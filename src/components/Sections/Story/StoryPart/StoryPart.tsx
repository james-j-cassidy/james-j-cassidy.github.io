import type { CSSProperties, ReactNode } from "react";
import styles from "./StoryPart.module.scss";

// What a story's parent gives each part: its place in the story.
export interface StoryPartProps {
  index: number;
}

interface Props extends StoryPartProps {
  name: string; // data-story-part, for the part's own styles and tests
  className?: string; // the part's own styles; they win over the defaults
  children: ReactNode;
}

// One part on a story's stage. The story sets, for the part's own styles:
//   --in   0 → 1 as the part enters (the first part: with the header's collapse)
//   --out  0 → 1 as the part leaves for the next
// Both are eased and follow the scroll, so every movement plays backward too. By default
// the part swings in and out like a carousel in 3D; a part choreographs its own movement
// by using --in and --out in its styles. Nothing fades.
// Only the current part takes pointer input; every part stays in the page for keyboard
// and screen readers.
function StoryPart({ index, name, className, children }: Props) {
  return (
    <div
      className={className ? `${styles.part} ${className}` : styles.part}
      data-story-part={name}
      data-part-index={index}
      style={{ "--part-index": index } as CSSProperties}
    >
      {children}
    </div>
  );
}

export default StoryPart;
