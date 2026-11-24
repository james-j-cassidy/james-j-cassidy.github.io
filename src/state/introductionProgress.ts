import { create } from "zustand";
import type { AchievementId } from "../content/introduction";

interface IntroductionProgressState {
  earned: Partial<Record<AchievementId, true>>;
  earn: (id: AchievementId) => void;
}

// Which of the Introduction's achievements the visitor has earned this visit, by playing
// with each part. Shown on the Introduction's last part. Not remembered between visits.
export const useIntroductionProgress = create<IntroductionProgressState>()(
  (set) => ({
    earned: {},
    earn: (id) =>
      set((state) =>
        state.earned[id] ? state : { earned: { ...state.earned, [id]: true } },
      ),
  }),
);

// For event handlers: record an achievement without subscribing to the store.
export function earnAchievement(id: AchievementId): void {
  useIntroductionProgress.getState().earn(id);
}
