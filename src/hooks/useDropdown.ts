import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

// Shared behavior for a disclosure button with a dropdown panel:
// - on open, focus moves to the element matching initialFocusSelector
// - Escape closes and returns focus to the button
// - a press outside, or keyboard focus leaving the root, closes it
export function useDropdown(initialFocusSelector: string) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    rootRef.current?.querySelector<HTMLElement>(initialFocusSelector)?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, initialFocusSelector]);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  const close = useCallback((returnFocusToButton: boolean) => {
    setIsOpen(false);
    if (returnFocusToButton) buttonRef.current?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      close(true);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (isOpen && !event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  return {
    isOpen,
    toggle,
    close,
    rootRef,
    buttonRef,
    handleKeyDown,
    handleBlur,
  };
}
