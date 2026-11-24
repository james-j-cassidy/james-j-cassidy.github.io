import { JOBS } from "../../../content/professionalJourney";
import Story from "../Story/Story";
import JobPart from "./JobPart/JobPart";

// The Professional Journey tab: a scroll story with one standard part per job, most
// recent first. Every job uses the same template (JobPart), themed by its company.
function ProfessionalJourney() {
  return (
    <Story>
      {JOBS.map((job, index) => (
        <JobPart key={job.id} index={index} job={job} jobs={JOBS} />
      ))}
    </Story>
  );
}

export default ProfessionalJourney;
