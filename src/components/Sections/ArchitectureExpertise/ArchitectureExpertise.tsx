import type { ComponentType } from "react";
import { ARCHITECTURE_PARTS } from "../../../content/architectureExpertise";
import { usePartGoTo } from "../../../hooks/useDeepLink";
import Story from "../Story/Story";
import Prologue from "../Prologue/Prologue";
import type { StoryPartProps } from "../Story/StoryPart/StoryPart";
import ArchitectureApproach from "./ArchitectureApproach/ArchitectureApproach";
import ArchitectureExplorer from "./ArchitectureExplorer/ArchitectureExplorer";
import ArchitectureDecisions from "./ArchitectureDecisions/ArchitectureDecisions";
import ArchitecturePlaybook from "./ArchitecturePlaybook/ArchitecturePlaybook";
import ArchitecturePipeline from "./ArchitecturePipeline/ArchitecturePipeline";
import ArchitectureMagic from "./ArchitectureMagic/ArchitectureMagic";
import ArchitectureNextStep from "./ArchitectureNextStep/ArchitectureNextStep";

// The Architecture Expertise tab's parts, in story order. Each is its own component so
// each can grow on its own.
const PARTS: readonly ComponentType<StoryPartProps>[] = [
  ArchitectureApproach,
  ArchitectureExplorer,
  ArchitectureDecisions,
  ArchitecturePlaybook,
  ArchitecturePipeline,
  ArchitectureMagic,
  ArchitectureNextStep,
];

// The Architecture Expertise tab's scroll story, built like the Introduction: the stage
// stays pinned while scrolling plays each part's movement, forward and backward.
function ArchitectureExpertise() {
  const goTo = usePartGoTo(
    "architecture-expertise",
    Object.keys(ARCHITECTURE_PARTS),
  );
  return (
    <Story goTo={goTo} prologue={<Prologue section="architecture-expertise" />}>
      {PARTS.map((Part, index) => (
        <Part key={index} index={index} />
      ))}
    </Story>
  );
}

export default ArchitectureExpertise;
