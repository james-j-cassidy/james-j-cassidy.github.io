import type { CSSProperties } from "react";
import type { PlaybookStep } from "../../../../../content/architectureExpertise";
import styles from "./ArchitecturePlaybookScene.module.scss";

// Job tiles: two columns, two rows, at the same place in each system.
const SLOT = [
  { x: 40, y: 190 },
  { x: 155, y: 190 },
  { x: 40, y: 230 },
  { x: 155, y: 230 },
];
const TILE_WIDTH = 105;
const TILE_HEIGHT = 32;
const ACROSS = 340; // from a legacy slot to the same cloud slot

interface ArchitecturePlaybookSceneProps {
  step: PlaybookStep;
  jobs: readonly string[];
  labels: {
    users: string;
    facade: string;
    legacy: string;
    legacyData: string;
    cloud: string;
    cloudData: string;
    archived: string;
  };
}

// The migration as a drawing: users at the top, the legacy desktop app and its
// database on one side, the cloud platform on the other. A facade drops in front of
// both; jobs slide across one by one and traffic follows them (each route's width is
// its share of the jobs); the databases sync while both still need the data; the
// strangler fig grows around the legacy app with every step until the app and its
// database fold away into the archive. Decorative: the step's card tells all of it.
function ArchitecturePlaybookScene({
  step,
  jobs,
  labels,
}: ArchitecturePlaybookSceneProps) {
  const legacyShare = (jobs.length - step.moved) / jobs.length;
  const cloudShare = step.moved / jobs.length;
  const progress = jobs.length ? step.moved / jobs.length : 0;

  return (
    <svg
      className={styles.scene}
      viewBox="0 0 640 340"
      aria-hidden="true"
      data-facade={step.facade ? "" : undefined}
      data-sync={step.sync ? "" : undefined}
      data-retired={step.retired ? "" : undefined}
      style={
        {
          "--legacy-share": legacyShare,
          "--cloud-share": cloudShare,
          "--growth": step.retired
            ? 1
            : (progress + (step.facade ? 0.15 : 0)) * 0.85,
        } as CSSProperties
      }
    >
      {/* Users drop in from above. */}
      <g className={styles.users}>
        <circle cx="300" cy="18" r="7" />
        <circle cx="320" cy="14" r="8" />
        <circle cx="340" cy="18" r="7" />
        <path d="M288 40c0-8 5-13 12-13s12 5 12 13M306 40c0-9 6-15 14-15s14 6 14 15M328 40c0-8 5-13 12-13s12 5 12 13" />
        <text x="372" y="34">
          {labels.users}
        </text>
      </g>

      {/* Routes: direct to the legacy app before the facade; through it after. */}
      <g className={styles.routes}>
        <path
          className={styles.direct}
          pathLength={1}
          d="M320 46V100H150V160"
        />
        <path className={styles.toFacade} pathLength={1} d="M320 46V88" />
        <path
          className={styles.toLegacy}
          pathLength={1}
          d="M300 124V140H150V160"
        />
        <path
          className={styles.toCloud}
          pathLength={1}
          d="M340 124V140H490V160"
        />
      </g>

      {/* The facade: one front door for every user. */}
      <g className={styles.facade}>
        <rect x="250" y="88" width="140" height="36" rx="6" />
        <text x="320" y="112">
          {labels.facade}
        </text>
      </g>

      {/* The legacy desktop app and its database. */}
      <g className={styles.legacy}>
        <g className={styles.legacyApp}>
          <rect
            className={styles.window}
            x="30"
            y="160"
            width="240"
            height="110"
            rx="6"
          />
          <path className={styles.titleBar} d="M30 182H270" />
          <circle className={styles.dot} cx="42" cy="171" r="3" />
          <circle className={styles.dot} cx="52" cy="171" r="3" />
          <text className={styles.boxLabel} x="64" y="176">
            {labels.legacy}
          </text>
          <path
            className={styles.vine}
            pathLength={1}
            d="M30 270C18 240 42 220 30 190S44 150 70 160 110 148 150 160 210 150 240 160 282 172 270 200 258 240 270 270 230 282 190 270 130 282 90 270 40 284 30 270"
          />
        </g>
        <g className={styles.legacyData}>
          <path
            className={styles.cylinder}
            d="M100 296c0-6 22-10 50-10s50 4 50 10v22c0 6-22 10-50 10s-50-4-50-10zM100 296c0 6 22 10 50 10s50-4 50-10"
          />
          <text className={styles.dataLabel} x="150" y="321">
            {labels.legacyData}
          </text>
        </g>
      </g>

      {/* Once retired, the archive in their place. */}
      <g className={styles.archive}>
        <rect x="95" y="230" width="110" height="60" rx="6" />
        <path d="M95 248H205M140 262h20" />
        <text x="150" y="306">
          {labels.archived}
        </text>
      </g>

      {/* The cloud platform and its database. */}
      <g className={styles.cloud}>
        <rect
          className={styles.window}
          x="370"
          y="160"
          width="240"
          height="110"
          rx="18"
        />
        <path
          className={styles.cloudIcon}
          d="M386 178a7 7 0 0 1 7-7 9 9 0 0 1 17 2 6 6 0 0 1 0 12h-22a5 5 0 0 1-2-7z"
        />
        <text className={styles.boxLabel} x="420" y="182">
          {labels.cloud}
        </text>
        <g className={styles.cloudData}>
          <path
            className={styles.cylinder}
            d="M440 296c0-6 22-10 50-10s50 4 50 10v22c0 6-22 10-50 10s-50-4-50-10zM440 296c0 6 22 10 50 10s50-4 50-10"
          />
          <text className={styles.dataLabel} x="490" y="321">
            {labels.cloudData}
          </text>
        </g>
      </g>

      {/* Sync between the databases while both still need the data. */}
      <g className={styles.sync}>
        <path d="M206 300H434M420 292l14 8-14 8M220 292l-14 8 14 8" />
      </g>

      {/* The jobs: each slides across when it moves. */}
      {jobs.map((job, index) => (
        <g
          key={job}
          className={styles.job}
          data-moved={index < step.moved ? "" : undefined}
          style={
            {
              "--order": index,
              "--across": `${ACROSS}px`,
            } as CSSProperties
          }
        >
          <rect
            x={SLOT[index].x}
            y={SLOT[index].y}
            width={TILE_WIDTH}
            height={TILE_HEIGHT}
            rx="5"
          />
          <text x={SLOT[index].x + TILE_WIDTH / 2} y={SLOT[index].y + 21}>
            {job}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default ArchitecturePlaybookScene;
