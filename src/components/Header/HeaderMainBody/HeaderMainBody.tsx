import { useId, useRef } from "react";
import styles from "./HeaderMainBody.module.scss";
import HeaderCircuitBoard from "./HeaderCircuitBoard/HeaderCircuitBoard";
import HeaderLookingProfileImage from "./HeaderLookingProfileImage/HeaderLookingProfileImage";
import HeaderSkillWheel from "./HeaderSkillWheel/HeaderSkillWheel";
import HeaderProfileInfo from "./HeaderProfileInfo/HeaderProfileInfo";
import HeaderHireMeButton from "./HeaderHireMeButton/HeaderHireMeButton";
import HeaderSkillSummary from "./HeaderSkillSummary/HeaderSkillSummary";
import HeaderSkillControls from "./HeaderSkillControls/HeaderSkillControls";
import { PROFILE } from "../../../content/profile";
import { SKILLS, SKILL_LABELS, skillPageHref } from "../../../content/skills";
import { useSkillCarousel } from "../../../hooks/useSkillCarousel";
import { useNavigation } from "../../../state/navigation";

const SKILL_INTERVAL_MS = 6000;

function HeaderMainBody() {
  // The wheel is hidden while the header is collapsed, so the rotation waits.
  const headerCollapsed = useNavigation((state) => state.headerCollapsed);
  const {
    index,
    turn,
    isPlaying,
    isRotating,
    step,
    goTo,
    togglePlaying,
    pauseOnInteraction,
  } = useSkillCarousel(SKILLS.length, SKILL_INTERVAL_MS, headerCollapsed);
  const idBase = useId();
  const panelId = `${idBase}-skill-panel`;
  const tabId = (tabIndex: number) => `${idBase}-skill-tab-${tabIndex}`;
  const skill = SKILLS[index];
  // Positions the circuit board wires together.
  const mainBodyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const hireRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mainBodyRef}
      className={styles.mainBody}
      data-header-part="main-body"
    >
      {/* Decorative backdrop: the portrait is the CPU, wired to the items below. */}
      <HeaderCircuitBoard
        containerRef={mainBodyRef}
        cpuRef={portraitRef}
        columnRef={centerRef}
        hireRef={hireRef}
        cardRef={cardRef}
      />

      {/* Portrait with the skill wheel around it. */}
      <div className={styles.stage} {...pauseOnInteraction}>
        <div ref={portraitRef} className={styles.portrait}>
          <HeaderLookingProfileImage alt={PROFILE.portraitAlt} />
        </div>
        <HeaderSkillWheel
          skills={SKILLS}
          selectedIndex={index}
          turn={turn}
          label={SKILL_LABELS.wheel}
          panelId={panelId}
          tabId={tabId}
          onSelect={goTo}
        />
      </div>

      {/* Center column: profile info with the call to action under it. */}
      <div ref={centerRef} className={styles.center}>
        <HeaderProfileInfo profile={PROFILE} />
        {/* "#contact" until the offer form exists. */}
        <div ref={hireRef} className={styles.hireSlot}>
          <HeaderHireMeButton label="Hire me" />
        </div>
      </div>

      {/* Selected skill's summary and the wheel controls. */}
      <div ref={cardRef} className={styles.skillCard} {...pauseOnInteraction}>
        <HeaderSkillSummary
          skills={SKILLS}
          selectedIndex={index}
          panelId={panelId}
          labelledBy={tabId(index)}
          live={isRotating ? "off" : "polite"}
          fullPageHref={skillPageHref(skill)}
          fullPageSuffix={SKILL_LABELS.fullPageSuffix}
          learnMoreLabel={SKILL_LABELS.learnMore}
        />
        <HeaderSkillControls
          position={index + 1}
          total={SKILLS.length}
          isPlaying={isPlaying}
          labels={SKILL_LABELS}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
          onTogglePlaying={togglePlaying}
        />
      </div>
    </div>
  );
}

export default HeaderMainBody;
