import type { ComponentType, CSSProperties } from "react";
import type { OpeningModuleId } from "../../../../../content/introduction";
import IntroductionOpeningSceneArchitecture from "./IntroductionOpeningSceneArchitecture/IntroductionOpeningSceneArchitecture";
import IntroductionOpeningSceneGrid from "./IntroductionOpeningSceneGrid/IntroductionOpeningSceneGrid";
import IntroductionOpeningSceneLeadership from "./IntroductionOpeningSceneLeadership/IntroductionOpeningSceneLeadership";
import styles from "./IntroductionOpeningBackdrop.module.scss";

export type OpeningScene = "start" | OpeningModuleId;

// A change of scene: the new one wipes in over the previous one, as a growing circle
// from the origin (the module that was selected), in percent of the opening's box.
export interface SceneChange {
  current: OpeningScene;
  previous: OpeningScene | null;
  origin: { x: number; y: number };
  count: number; // one more per change; restarts the wipe and the scene's build
}

const SCENES: Record<OpeningScene, ComponentType> = {
  start: IntroductionOpeningSceneGrid,
  architecture: IntroductionOpeningSceneArchitecture,
  leadership: IntroductionOpeningSceneLeadership,
};

interface IntroductionOpeningBackdropProps {
  change: SceneChange;
}

// The opening's full-stage background. Starts on the neon grid; after that shows the
// scene of the module chosen last. The previous scene stays underneath until the wipe
// has covered it. Decorative: hidden from screen readers.
function IntroductionOpeningBackdrop({
  change,
}: IntroductionOpeningBackdropProps) {
  const { current, previous, origin, count } = change;
  const layers = previous
    ? [
        { scene: previous, key: count - 1, wipe: false },
        { scene: current, key: count, wipe: true },
      ]
    : [{ scene: current, key: count, wipe: false }];

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {layers.map(({ scene, key, wipe }) => {
        const Scene = SCENES[scene];
        return (
          <div
            key={key}
            className={styles.layer}
            data-wipe={wipe ? "" : undefined}
            style={
              {
                "--origin-x": `${origin.x}%`,
                "--origin-y": `${origin.y}%`,
              } as CSSProperties
            }
          >
            <Scene />
          </div>
        );
      })}
    </div>
  );
}

export default IntroductionOpeningBackdrop;
