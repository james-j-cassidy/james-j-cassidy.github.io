import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  INTRODUCTION_OPENING,
  INTRODUCTION_PARTS,
  type OpeningModuleId,
} from "../../../../content/introduction";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import { earnAchievement } from "../../../../state/introductionProgress";
import StoryPart, {
  type StoryPartProps,
} from "../../Story/StoryPart/StoryPart";
import IntroductionOpeningBackdrop, {
  type OpeningScene,
  type SceneChange,
} from "./IntroductionOpeningBackdrop/IntroductionOpeningBackdrop";
import IntroductionOpeningDetail from "./IntroductionOpeningDetail/IntroductionOpeningDetail";
import IntroductionOpeningModule from "./IntroductionOpeningModule/IntroductionOpeningModule";
import styles from "./IntroductionOpening.module.scss";

// The Introduction's first part, built like a game screen.
//
// Two modules swing in from opposite sides as the header collapses: architecture from
// the reading start, leadership from the other side. Selecting a module floats its
// detail card up out of the depth, and wipes in that module's background scene from the
// module outward; the scene stays on the last one chosen. Moving the mouse tilts the
// scene a little. Escape or the card's close button puts the card away.
//
// Reduced motion: everything is in place, cards and scenes change without movement.
function IntroductionOpening({ index }: StoryPartProps) {
  const { heading } = INTRODUCTION_PARTS.opening;
  const { modules, hint, close } = INTRODUCTION_OPENING;
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<Partial<Record<OpeningModuleId, HTMLElement>>>({});
  const detailIds: Record<OpeningModuleId, string> = {
    architecture: useId(),
    leadership: useId(),
  };
  const [openModule, setOpenModule] = useState<OpeningModuleId | null>(null);
  const [scene, setScene] = useState<SceneChange>({
    current: "start",
    previous: null,
    origin: { x: 50, y: 50 },
    count: 0,
  });

  function select(id: OpeningModuleId, button: HTMLElement) {
    earnAchievement("opening");
    setOpenModule((current) => (current === id ? null : id));
    if (scene.current === id) return;
    const box = contentRef.current?.getBoundingClientRect();
    const spot = button.getBoundingClientRect();
    const origin = box
      ? {
          x: ((spot.left + spot.width / 2 - box.left) / box.width) * 100,
          y: ((spot.top + spot.height / 2 - box.top) / box.height) * 100,
        }
      : { x: 50, y: 50 };
    setScene((last) => ({
      current: id as OpeningScene,
      previous: last.current,
      origin,
      count: last.count + 1,
    }));
  }

  function closeDetail() {
    if (!openModule) return;
    moduleRefs.current[openModule]?.focus();
    setOpenModule(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") closeDetail();
  }

  // The scene leans slightly toward the mouse (not touch, not with reduced motion).
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reducedMotion) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    event.currentTarget.style.setProperty("--lean-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--lean-y", y.toFixed(3));
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--lean-x", "0");
    event.currentTarget.style.setProperty("--lean-y", "0");
  }

  return (
    <StoryPart index={index} name="opening" className={styles.part}>
      <IntroductionOpeningBackdrop change={scene} />
      <h3 className={styles.heading}>{heading}</h3>
      {/* Escape is a shortcut; the modules and the card's button are the controls. */}
      {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={contentRef}
        className={styles.content}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {modules.map((module, position) => (
          <div
            key={module.id}
            className={styles.slot}
            data-side={position === 0 ? "start" : "end"}
          >
            <IntroductionOpeningModule
              module={module}
              expanded={openModule === module.id}
              controls={detailIds[module.id]}
              buttonRef={(element) => {
                if (element) moduleRefs.current[module.id] = element;
              }}
              onSelect={select}
            />
          </div>
        ))}
        <p className={styles.hint} data-hidden={openModule ? "" : undefined}>
          <span className={styles.hintMark} aria-hidden="true">
            ▸
          </span>{" "}
          {hint}
        </p>
        {modules.map((module) => (
          <IntroductionOpeningDetail
            key={module.id}
            id={detailIds[module.id]}
            module={module}
            open={openModule === module.id}
            closeLabel={close}
            onClose={closeDetail}
          />
        ))}
      </div>
    </StoryPart>
  );
}

export default IntroductionOpening;
