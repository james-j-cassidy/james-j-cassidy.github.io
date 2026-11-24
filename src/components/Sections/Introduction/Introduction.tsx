import type { ComponentType } from "react";
import Story from "../Story/Story";
import type { StoryPartProps } from "../Story/StoryPart/StoryPart";
import IntroductionBeyondWork from "./IntroductionBeyondWork/IntroductionBeyondWork";
import IntroductionLookingFor from "./IntroductionLookingFor/IntroductionLookingFor";
import IntroductionNextStep from "./IntroductionNextStep/IntroductionNextStep";
import IntroductionOpening from "./IntroductionOpening/IntroductionOpening";
import IntroductionOrigin from "./IntroductionOrigin/IntroductionOrigin";
import IntroductionPrinciples from "./IntroductionPrinciples/IntroductionPrinciples";
import IntroductionThisSite from "./IntroductionThisSite/IntroductionThisSite";

// The Introduction's parts, in story order. Each is its own component so each can grow
// on its own.
const PARTS: readonly ComponentType<StoryPartProps>[] = [
  IntroductionOpening,
  IntroductionOrigin,
  IntroductionPrinciples,
  IntroductionThisSite,
  IntroductionLookingFor,
  IntroductionBeyondWork,
  IntroductionNextStep,
];

// The Introduction section's scroll story: the stage stays pinned while scrolling plays
// each part's morph into the next, forward and backward.
function Introduction() {
  return (
    <Story>
      {PARTS.map((Part, index) => (
        <Part key={index} index={index} />
      ))}
    </Story>
  );
}

export default Introduction;
