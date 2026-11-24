import type { Job } from "../../../../../content/professionalJourney";
import UsafSymbol from "../../../../UsafSymbol/UsafSymbol";
import styles from "./JobPartCompany.module.scss";

interface JobPartCompanyProps {
  job: Job;
  presentLabel: string;
  techLabel: string;
}

// The job's card: the company's emblem (a drawn emblem such as the Air Force symbol,
// its logo where James allows one, otherwise its monogram), the company as the part's heading, role and dates, a short summary and
// the technologies.
function JobPartCompany({ job, presentLabel, techLabel }: JobPartCompanyProps) {
  return (
    <div className={styles.card}>
      <div className={styles.identity}>
        {/* Decorative: the heading beside it names the company. */}
        <span className={styles.emblem} aria-hidden="true">
          {job.emblem === "usaf" ? (
            <UsafSymbol className={styles.symbol} />
          ) : job.logo ? (
            <img src={job.logo} alt="" />
          ) : (
            job.monogram
          )}
        </span>
        <div className={styles.names}>
          <h3 className={styles.company}>{job.company}</h3>
          <p className={styles.role}>{job.role}</p>
          <p className={styles.dates}>
            {job.start} – {job.end ?? presentLabel}
          </p>
        </div>
      </div>
      <p className={styles.summary}>{job.summary}</p>
      <div className={styles.techBlock}>
        <p className={styles.techLabel}>{techLabel}</p>
        <ul className={styles.tech}>
          {job.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default JobPartCompany;
