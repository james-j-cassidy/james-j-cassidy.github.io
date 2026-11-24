import { useState } from "react";
import {
  CREDENTIALS,
  CREDENTIALS_LABELS,
  JOBS,
  PROFESSIONAL_JOURNEY_LABELS,
  type CredentialSort,
} from "../../../content/professionalJourney";
import { toSectionStart } from "../../../state/navigation";
import Story from "../Story/Story";
import SortSelect from "../SubSections/SortSelect/SortSelect";
import SubSections from "../SubSections/SubSections";
import SubTabs, { type SubTab } from "../SubSections/SubTabs/SubTabs";
import CredentialPart from "./CredentialPart/CredentialPart";
import { sortCredentials } from "./CredentialPart/sortCredentials";
import JobPart from "./JobPart/JobPart";

type JourneyChain = "career" | "credentials";

const ICONS: Record<JourneyChain, string> = {
  career: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  credentials: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6",
};

// The order of the sub-sections, for the direction the new one slides in from.
const ORDER: readonly JourneyChain[] = ["career", "credentials"];

// The Professional Journey tab, divided into two sub-sections the way the main tabs
// divide the site, each its own scroll story with one section per item: Career, one
// part per job, most recent first (JobPart); and Education & credentials, one part per
// credential (CredentialPart), most important first by default. Only one shows at a
// time, and the two never scroll into each other.
//
// Switching sub-tabs works like changing tab; sorting rebuilds the credentials story in
// the new order. Either way the page moves to the start first, so the new story never
// plays through parts on the way there.
function ProfessionalJourney() {
  const { chainsLabel, chains, chainsShort } = PROFESSIONAL_JOURNEY_LABELS;
  const [current, setCurrent] = useState<JourneyChain>("career");
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [sort, setSort] = useState<CredentialSort>("importance");
  const credentials = sortCredentials(CREDENTIALS, sort);
  const tabs: readonly SubTab<JourneyChain>[] = ORDER.map((id) => ({
    id,
    label: chains[id],
    short: chainsShort[id],
    icon: ICONS[id],
  }));

  function show(chain: JourneyChain) {
    if (chain === current) return;
    toSectionStart();
    setDirection(ORDER.indexOf(chain) > ORDER.indexOf(current) ? 1 : -1);
    setCurrent(chain);
  }

  function reorder(next: CredentialSort) {
    if (next === sort) return;
    toSectionStart();
    setDirection(0);
    setSort(next);
  }

  return (
    <SubSections
      direction={direction}
      bar={
        <>
          <SubTabs
            label={chainsLabel}
            tabs={tabs}
            current={current}
            onShow={show}
          />
          {current === "credentials" && (
            <SortSelect
              label={CREDENTIALS_LABELS.sortLabel}
              sorts={CREDENTIALS_LABELS.sorts}
              sort={sort}
              onSort={reorder}
            />
          )}
        </>
      }
    >
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
    </SubSections>
  );
}

export default ProfessionalJourney;
