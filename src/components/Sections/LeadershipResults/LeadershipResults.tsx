import type { ComponentType } from "react";
import { LEADERSHIP_PARTS } from "../../../content/leadershipResults";
import { usePartGoTo } from "../../../hooks/useDeepLink";
import Story from "../Story/Story";
import Prologue from "../Prologue/Prologue";
import type { StoryPartProps } from "../Story/StoryPart/StoryPart";
import LeadershipDelivery from "./LeadershipDelivery/LeadershipDelivery";
import LeadershipHardCalls from "./LeadershipHardCalls/LeadershipHardCalls";
import LeadershipLead from "./LeadershipLead/LeadershipLead";
import LeadershipResultsPeaks from "./LeadershipResultsPeaks/LeadershipResultsPeaks";
import LeadershipService from "./LeadershipService/LeadershipService";
import LeadershipTrust from "./LeadershipTrust/LeadershipTrust";
import LeadershipTheirWords from "./LeadershipTheirWords/LeadershipTheirWords";
import styles from "./LeadershipResults.module.scss";

// The Leadership & Results tab's parts, in story order: from daybreak to the summit.
const PARTS: readonly ComponentType<StoryPartProps>[] = [
  LeadershipLead,
  LeadershipResultsPeaks,
  LeadershipTrust,
  LeadershipDelivery,
  LeadershipHardCalls,
  LeadershipService,
  LeadershipTheirWords,
];

// The Leadership & Results tab: a scroll story with a sunrise theme. The day breaks on
// how James leads, climbs through results, teams, delivery and hard calls, looks back
// at where it started, and reaches the summit with the people who were there.
function LeadershipResults() {
  const goTo = usePartGoTo("leadership-results", Object.keys(LEADERSHIP_PARTS));
  return (
    <div className={styles.leadership}>
      <Story goTo={goTo} prologue={<Prologue section="leadership-results" />}>
        {PARTS.map((Part, index) => (
          <Part key={index} index={index} />
        ))}
      </Story>
    </div>
  );
}

export default LeadershipResults;
