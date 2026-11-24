import { useRef, type KeyboardEvent } from "react";

// Keyboard movement for a set of tabs (or radios) where only the selected one is in the
// tab order: the arrow keys move to the next or previous one (wrapping), Home and End
// jump to the ends. Selecting also moves focus. Returns a ref setter per item and the
// key handler to put on each item. upIsNext: for a set drawn bottom to top (floor
// buttons), where ArrowUp moves to the next one.
export function useRovingTabs(
  count: number,
  selected: number,
  onSelect: (index: number) => void,
  upIsNext = false,
) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const moves: Record<string, number> = {
      ArrowRight: (selected + 1) % count,
      ArrowDown: upIsNext
        ? (selected - 1 + count) % count
        : (selected + 1) % count,
      ArrowLeft: (selected - 1 + count) % count,
      ArrowUp: upIsNext
        ? (selected + 1) % count
        : (selected - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  }

  function refFor(index: number) {
    return (element: HTMLElement | null) => {
      refs.current[index] = element;
    };
  }

  return { refFor, onKeyDown };
}
