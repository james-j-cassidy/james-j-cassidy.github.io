import { useState } from "react";
import {
  CREDENTIALS,
  JOBS,
  type CredentialSort as Sort,
} from "../../../content/professionalJourney";
import { useNavigation } from "../../../state/navigation";
import Story from "../Story/Story";
import CredentialPart from "./CredentialPart/CredentialPart";
import { sortCredentials } from "./CredentialPart/sortCredentials";
import CredentialSort from "./CredentialSort/CredentialSort";
import JobPart from "./JobPart/JobPart";
import JourneyChains from "./JourneyChains/JourneyChains";
import type { JourneyChain } from "./journeyChain";
import styles from "./ProfessionalJourney.module.scss";

// The order of the sub-sections, for the direction the new one slides in from.
const ORDER: readonly JourneyChain[] = ["career", "credentials"];

// Back to a story's start: collapsed header, its first part; expanded, the top.
function toStoryStart() {
  const { headerCollapsed, collapsedSectionTop } = useNavigation.getState();
  window.scrollTo({
    top: headerCollapsed ? collapsedSectionTop : 0,
    behavior: "instant",
  });
}

// The Professional Journey tab, divided into two sub-sections the way the main tabs
// divide the site, each its own scroll story with one section per item: Career, one
// part per job, most recent first (JobPart); and Education & credentials, one part per
// credential (CredentialPart), most important first by default. Only one shows at a
// time, and the two never scroll into each other.
//
// The sub-tabs (and, for the credentials, the sort) sit in a bar pinned under the header
// that never moves; the story plays below it. Switching works like changing tab: the
// other story slides in from its side and starts from its beginning, keeping the header
// as it was. Sorting rebuilds the credentials story in the new order, from its start.
// Either way the page moves to the start first, so the new story never plays through
// parts on the way there.
function ProfessionalJourney() {
  const [current, setCurrent] = useState<JourneyChain>("career");
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [sort, setSort] = useState<Sort>("importance");
  const credentials = sortCredentials(CREDENTIALS, sort);

  function show(chain: JourneyChain) {
    if (chain === current) return;
    toStoryStart();
    setDirection(ORDER.indexOf(chain) > ORDER.indexOf(current) ? 1 : -1);
    setCurrent(chain);
  }

  function reorder(next: Sort) {
    if (next === sort) return;
    toStoryStart();
    setDirection(0);
    setSort(next);
  }

  return (
    <div className={styles.journey}>
      <div className={styles.bar}>
        <JourneyChains current={current} onShow={show} />
        {current === "credentials" && (
          <CredentialSort sort={sort} onSort={reorder} />
        )}
      </div>
      <div className={styles.stories} data-direction={direction}>
        {current === "career" ? (
          <Story key="career">
            {JOBS.map((job, index) => (
              <JobPart key={job.id} index={index} job={job} jobs={JOBS} />
            ))}
          </Story>
        ) : (
          <Story key={`credentials-${sort}`}>
            {credentials.map((credential, index) => (
              <CredentialPart
                key={credential.id}
                index={index}
                credential={credential}
                credentials={credentials}
              />
            ))}
          </Story>
        )}
      </div>
    </div>
  );
}

export default ProfessionalJourney;
