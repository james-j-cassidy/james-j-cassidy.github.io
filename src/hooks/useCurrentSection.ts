import { useNavigation } from "../state/navigation";

// Index of the section the visitor is in, for the tabs, location marks and section deck.
export function useCurrentSection(): number {
  return useNavigation((state) => state.sectionIndex);
}
