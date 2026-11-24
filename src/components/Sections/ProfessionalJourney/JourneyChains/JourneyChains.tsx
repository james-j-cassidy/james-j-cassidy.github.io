import { PROFESSIONAL_JOURNEY_LABELS } from "../../../../content/professionalJourney";
import type { JourneyChain } from "../journeyChain";
import styles from "./JourneyChains.module.scss";

const ICONS: Record<JourneyChain, string> = {
  career: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  credentials: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6",
};

interface JourneyChainsProps {
  current: JourneyChain;
  onShow: (chain: JourneyChain) => void;
}

// The Professional Journey's sub-tabs: Career or Education & credentials. Like the main
// tabs one level down: the current sub-section is marked, and choosing the other swaps
// its whole story in.
function JourneyChains({ current, onShow }: JourneyChainsProps) {
  const { chainsLabel, chains, chainsShort } = PROFESSIONAL_JOURNEY_LABELS;

  return (
    <nav className={styles.chains} aria-label={chainsLabel}>
      {(Object.keys(chains) as JourneyChain[]).map((chain) => (
        <button
          key={chain}
          type="button"
          className={styles.chain}
          aria-current={chain === current ? "true" : undefined}
          onClick={() => onShow(chain)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICONS[chain]} />
          </svg>
          <span className={styles.long}>{chains[chain]}</span>
          <span className={styles.short}>{chainsShort[chain]}</span>
        </button>
      ))}
    </nav>
  );
}

export default JourneyChains;
