import { useMemo, useSyncExternalStore } from "react";
import { usePreferences } from "../../../../../state/preferences";
import IntroductionThisSiteReadout from "./IntroductionThisSiteReadout/IntroductionThisSiteReadout";
import { measureContrast } from "./contrast";
import styles from "./IntroductionThisSiteDiagnostics.module.scss";

interface IntroductionThisSiteDiagnosticsProps {
  labels: {
    diagnostics: string;
    measured: string;
    pass: string;
    fail: string;
    readings: { text: string; accent: string; muted: string };
    motion: string;
    motionFull: string;
    motionReduced: string;
    themeSwitch: string;
  };
  reducedMotion: boolean;
  onThemeSwitched: () => void;
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeToScheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Proof the site does what it claims, measured live: the contrast of text, accent and
// muted text against the page background as currently themed, each against the AAA
// minimum, plus the motion setting in effect. The theme switch changes the whole site
// for real; the readings are measured again from the new colors.
function IntroductionThisSiteDiagnostics({
  labels,
  reducedMotion,
  onThemeSwitched,
}: IntroductionThisSiteDiagnosticsProps) {
  const theme = usePreferences((state) => state.theme);
  const setTheme = usePreferences((state) => state.setTheme);
  const systemDark = useSyncExternalStore(
    subscribeToScheme,
    () => window.matchMedia(DARK_QUERY).matches,
    () => true,
  );
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  // Measured for the theme on screen. The preferences store puts the theme on <html> as
  // soon as it changes, before this renders, so the reading is of the new colors.
  const ratios = useMemo(
    () =>
      measureContrast(
        {
          text: "var(--color-text)",
          accent: "var(--color-accent)",
          muted: "var(--color-text-muted)",
        },
        "var(--color-bg)",
      ),
    // The theme in effect is what the colors depend on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDark],
  );

  function switchTheme() {
    setTheme(isDark ? "light" : "dark");
    onThemeSwitched();
  }

  return (
    <section className={styles.diagnostics} aria-label={labels.diagnostics}>
      <div className={styles.header}>
        <div>
          <p className={styles.tag}>{labels.diagnostics}</p>
          <p className={styles.note}>{labels.measured}</p>
        </div>
        <div className={styles.controls}>
          <span className={styles.motion}>
            {labels.motion}:{" "}
            <strong>
              {reducedMotion ? labels.motionReduced : labels.motionFull}
            </strong>
          </span>
          <button
            type="button"
            role="switch"
            className={styles.switch}
            aria-checked={isDark}
            onClick={switchTheme}
          >
            <span className={styles.switchLabel}>{labels.themeSwitch}</span>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.knob} />
            </span>
          </button>
        </div>
      </div>
      <div className={styles.readings}>
        {(["text", "accent", "muted"] as const).map((key) => (
          <IntroductionThisSiteReadout
            key={key}
            label={labels.readings[key]}
            ratio={ratios[key]}
            passLabel={labels.pass}
            failLabel={labels.fail}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

export default IntroductionThisSiteDiagnostics;
