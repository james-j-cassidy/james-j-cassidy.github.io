import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import portrait400 from "../../assets/images/portrait-400.webp";
import {
  BENEFITS,
  CURRENCIES,
  HIRE_ME_ENDPOINT,
  HIRE_ME_LABELS,
  HIRE_ME_TO,
  lookChance,
  offerMailto,
  offerPayload,
  type BenefitId,
  type Currency,
  type Engagement,
  type Offer,
  type PayPeriod,
  type WorkPlace,
} from "../../content/hireMe";
import { PROFILE } from "../../content/profile";
import { STACK } from "../../content/techStack";
import { useHireMe } from "../../state/hireMe";
import LogoMark from "../LogoMark/LogoMark";
import HireMeChance from "./HireMeChance/HireMeChance";
import HireMeFit from "./HireMeFit/HireMeFit";
import HireMeMonogram from "./HireMeMonogram/HireMeMonogram";
import HireMeSegmented from "./HireMeSegmented/HireMeSegmented";
import HireMeSelect from "./HireMeSelect/HireMeSelect";
import HireMeSkills from "./HireMeSkills/HireMeSkills";
import HireMeMaskedInput from "./HireMeMaskedInput/HireMeMaskedInput";
import {
  formatMoney,
  formatPhone,
  masked,
  moneyGhost,
  phoneGhost,
} from "./masks";
import styles from "./HireMe.module.scss";

// What the visitor is filling in. Skills are stack ids here; benefits hold each ticked
// benefit's detail ("" when it has none).
interface Draft extends Omit<Offer, "benefits" | "currency"> {
  currency: Currency;
  benefits: Partial<Record<BenefitId, string>>;
}

const EMPTY: Draft = {
  engagement: "full-time",
  jobTitle: "",
  company: "",
  workPlace: "remote",
  location: "",
  start: "",
  description: "",
  payFrom: "",
  payTo: "",
  currency: "USD",
  period: "year",
  benefits: {},
  otherBenefits: "",
  skills: [],
  otherSkills: [],
  name: "",
  email: "",
  phone: "",
  note: "",
};

const DESCRIPTION_MAX = 4000;
const NOTE_MAX = 500;

// The pay period each kind of work usually quotes, until the visitor picks one.
const USUAL_PERIOD: Record<Engagement, PayPeriod> = {
  "full-time": "year",
  contract: "hour",
  consulting: "hour",
};

const ENGAGEMENT_ICONS: Record<Engagement, string> = {
  "full-time": "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  contract: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  consulting: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
};

type ErrorKey = keyof typeof HIRE_ME_LABELS.errors;
type Status = "idle" | "sending" | "sent" | "opened" | "failed";

const amountOf = (value: string) => Number(value.replace(/,/g, ""));

// How long the form has been open, for the script's bot check.
const openFor = (since: number) => Date.now() - since;

// Hands the offer to the visitor's email app.
const openEmailApp = (href: string) => window.location.assign(href);

// What still needs fixing, in the form's order.
function validate(draft: Draft): Partial<Record<ErrorKey, string>> {
  const L = HIRE_ME_LABELS.errors;
  const errors: Partial<Record<ErrorKey, string>> = {};
  if (!draft.jobTitle.trim()) errors.jobTitle = L.jobTitle;
  if (
    draft.payFrom &&
    draft.payTo &&
    amountOf(draft.payTo) < amountOf(draft.payFrom)
  ) {
    errors.payRange = L.payRange;
  }
  if (!draft.name.trim()) errors.name = L.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
    errors.email = L.email;
  }
  return errors;
}

// The Hire Me form, in a modal dialog (the browser's own: focus stays inside, Escape
// closes, focus returns to the button that opened it). James's brand throughout: his
// logo, portrait and name at the top, his monogram repeated faintly behind.
//
// Five numbered steps: the kind of work (full-time, contract or off-hours consulting),
// the role, pay and benefits, the skills it needs (moved over from his stack, or added
// as others, with a live fit meter), and the sender. Fields use the right input types
// and autocomplete, money and phone are masked as they are typed, and every error is
// written next to its field and listed in a summary that takes focus on Send.
//
// Send saves the offer to James's Google Sheet through its script (HIRE_ME_ENDPOINT),
// which also emails him; until that is set, Send opens the offer in the visitor's own
// email app. A hidden trap field and the time the form was open let the script ignore
// bots. After sending, the form starts fresh next time.
function HireMe() {
  const L = HIRE_ME_LABELS;
  const open = useHireMe((state) => state.open);
  const hide = useHireMe((state) => state.hide);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const field = (name: string) => `${id}-${name}`;
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [periodChosen, setPeriodChosen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [checked, setChecked] = useState(false); // Send was pressed: show errors
  const [trap, setTrap] = useState("");
  const openedAt = useRef(0);
  // One per send; a reply that arrives after the form closed (or a newer send) is ignored.
  const sendId = useRef(0);
  const errors = checked ? validate(draft) : {};
  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openedAt.current = Date.now();
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function set<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((now) => ({ ...now, [key]: value }));
    if (status === "failed" || status === "opened") setStatus("idle");
  }

  // Closing after a send clears the form for the next offer.
  function close() {
    sendId.current += 1;
    if (status === "sent" || status === "opened") {
      setDraft(EMPTY);
      setPeriodChosen(false);
      setChecked(false);
      setTrap("");
    }
    setStatus("idle");
    hide();
  }

  // Escape inside an open list closes the list, not the form.
  function cancel(event: SyntheticEvent<HTMLDialogElement>) {
    const active = document.activeElement;
    if (active?.getAttribute("aria-expanded") === "true")
      event.preventDefault();
  }

  function chooseEngagement(engagement: Engagement) {
    setDraft((now) => ({
      ...now,
      engagement,
      period: periodChosen ? now.period : USUAL_PERIOD[engagement],
    }));
  }

  function toggleBenefit(benefit: BenefitId) {
    const next = { ...draft.benefits };
    if (benefit in next) delete next[benefit];
    else next[benefit] = "";
    set("benefits", next);
  }

  // The finished offer: names for skills (in stack order) and benefits (with detail),
  // and the chance shown to the sender.
  function offer(): Offer {
    return {
      ...draft,
      chance: chance.percent,
      skills: STACK.filter((item) => draft.skills.includes(item.id)).map(
        (item) => item.name,
      ),
      benefits: BENEFITS.filter((benefit) => benefit.id in draft.benefits).map(
        (benefit) => {
          const detail = draft.benefits[benefit.id]?.trim();
          return detail ? `${benefit.label} (${detail})` : benefit.label;
        },
      ),
    };
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setChecked(true);
    if (Object.keys(validate(draft)).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (!HIRE_ME_ENDPOINT) {
      openEmailApp(offerMailto(offer()).href);
      setStatus("opened");
      return;
    }
    setStatus("sending");
    const id = (sendId.current += 1);
    let next: Status = "failed";
    try {
      // A plain-text body: a simple request, sent without asking the script first. It
      // gives up after 15 seconds rather than leave the visitor waiting.
      const response = await fetch(HIRE_ME_ENDPOINT, {
        method: "POST",
        body: offerPayload(offer(), openFor(openedAt.current), trap),
        signal: AbortSignal.timeout(15000),
      });
      if (response.ok) {
        const result = (await response.json()) as { ok?: boolean };
        if (result.ok) next = "sent";
      }
    } catch {
      // A network failure or the timeout: "failed", with the email fallback.
    }
    if (id === sendId.current) setStatus(next);
  }

  // A field's error, written under it and tied to it.
  function errorFor(key: ErrorKey) {
    const message = errors[key];
    return message ? (
      <p id={field(`${key}-error`)} className={styles.error}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 2 20h20zM12 10v4M12 17h.01" />
        </svg>
        {message}
      </p>
    ) : null;
  }

  const describedBy = (...ids: (string | false)[]) =>
    ids.filter(Boolean).join(" ") || undefined;

  const currency = CURRENCIES.find((one) => one.value === draft.currency);
  const chance = lookChance({
    engagement: draft.engagement,
    workPlace: draft.workPlace,
    payFrom: draft.payFrom,
    payTo: draft.payTo,
    currency: draft.currency,
    period: draft.period,
    benefitCount: Object.keys(draft.benefits).length,
    skillsMine: draft.skills.length,
    skillsOther: draft.otherSkills.length,
  });

  function step(index: number, children: ReactNode) {
    return (
      <fieldset className={styles.step}>
        <legend className={styles.legend}>
          <span className={styles.stepNumber} aria-hidden="true">
            {L.stepNumber(index + 1)}
          </span>
          {L.steps[index]}
        </legend>
        {children}
      </fieldset>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${field("eyebrow")} ${field("brand-name")}`}
      onClose={close}
      onCancel={cancel}
    >
      <HireMeMonogram />
      <form className={styles.form} noValidate onSubmit={send}>
        <header className={styles.header}>
          <span className={styles.portrait} aria-hidden="true">
            <img src={portrait400} alt="" width={400} height={400} />
          </span>
          <div className={styles.brand}>
            <LogoMark className={styles.logo} />
            <p id={field("eyebrow")} className={styles.eyebrow}>
              {L.eyebrow}
            </p>
            <h2 id={field("brand-name")} className={styles.name}>
              {PROFILE.name}
            </h2>
            <p className={styles.tagline}>
              {PROFILE.title}
              {PROFILE.highlights.map((highlight) => (
                <span key={highlight.text}>
                  <span aria-hidden="true"> · </span>
                  {highlight.text}
                </span>
              ))}
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label={L.close}
            onClick={close}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {status === "sent" && (
          <div className={styles.sent} role="status">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 10 17 19 7" />
            </svg>
            <h3 className={styles.sentTitle}>{L.sentTitle}</h3>
            <p className={styles.sentText}>{L.sentText(draft.email)}</p>
          </div>
        )}

        <div className={styles.body} hidden={status === "sent"}>
          <p className={styles.intro}>{L.intro}</p>

          {errorCount > 0 && (
            <div
              ref={summaryRef}
              className={styles.summary}
              role="alert"
              tabIndex={-1}
            >
              <p className={styles.summaryTitle}>{L.summary(errorCount)}</p>
              <ul>
                {(Object.keys(errors) as ErrorKey[]).map((key) => {
                  const target = field(key === "payRange" ? "to" : key);
                  return (
                    <li key={key}>
                      <a
                        href={`#${target}`}
                        onClick={(event) => {
                          event.preventDefault();
                          document.getElementById(target)?.focus();
                        }}
                      >
                        {errors[key]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {step(
            0,
            <div className={styles.engagements}>
              {(Object.keys(L.engagements) as Engagement[]).map((kind) => (
                <label key={kind} className={styles.engagement}>
                  <input
                    type="radio"
                    name={field("engagement")}
                    value={kind}
                    checked={draft.engagement === kind}
                    onChange={() => chooseEngagement(kind)}
                  />
                  <span className={styles.engagementIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={ENGAGEMENT_ICONS[kind]} />
                    </svg>
                  </span>
                  <span className={styles.engagementText}>
                    <span className={styles.engagementName}>
                      {L.engagements[kind]}
                    </span>
                    <span className={styles.engagementNote}>
                      {L.engagementNotes[kind]}
                    </span>
                  </span>
                  <span className={styles.radio} aria-hidden="true" />
                </label>
              ))}
            </div>,
          )}

          {step(
            1,
            <>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={field("jobTitle")}>
                    {L.jobTitle}{" "}
                    <span className={styles.requiredMark}>({L.required})</span>
                  </label>
                  <input
                    id={field("jobTitle")}
                    className={styles.input}
                    type="text"
                    required
                    autoComplete="organization-title"
                    aria-invalid={Boolean(errors.jobTitle)}
                    aria-describedby={describedBy(
                      Boolean(errors.jobTitle) && field("jobTitle-error"),
                    )}
                    value={draft.jobTitle}
                    onChange={(event) => set("jobTitle", event.target.value)}
                  />
                  {errorFor("jobTitle")}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={field("company")}>
                    {L.company}
                  </label>
                  <input
                    id={field("company")}
                    className={styles.input}
                    type="text"
                    autoComplete="organization"
                    value={draft.company}
                    onChange={(event) => set("company", event.target.value)}
                  />
                </div>
              </div>
              <div className={styles.grid}>
                <HireMeSegmented
                  name={field("place")}
                  label={L.workPlace}
                  options={L.workPlaces}
                  value={draft.workPlace}
                  onChange={(value: WorkPlace) => set("workPlace", value)}
                />
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={field("location")}>
                    {L.location}
                  </label>
                  <input
                    id={field("location")}
                    className={styles.input}
                    type="text"
                    autoComplete="address-level2"
                    aria-describedby={field("location-hint")}
                    value={draft.location}
                    onChange={(event) => set("location", event.target.value)}
                  />
                  <p id={field("location-hint")} className={styles.hint}>
                    {L.locationHint}
                  </p>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={field("start")}>
                    {L.start}
                  </label>
                  <input
                    id={field("start")}
                    className={styles.input}
                    type="month"
                    aria-describedby={field("start-hint")}
                    value={draft.start}
                    onChange={(event) => set("start", event.target.value)}
                  />
                  <p id={field("start-hint")} className={styles.hint}>
                    {L.startHint}
                  </p>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={field("about")}>
                  {L.description}
                </label>
                <textarea
                  id={field("about")}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={5}
                  maxLength={DESCRIPTION_MAX}
                  aria-describedby={`${field("about-hint")} ${field("about-count")}`}
                  value={draft.description}
                  onChange={(event) => set("description", event.target.value)}
                />
                <div className={styles.under}>
                  <p id={field("about-hint")} className={styles.hint}>
                    {L.descriptionHint}
                  </p>
                  <p id={field("about-count")} className={styles.count}>
                    {L.characters(draft.description.length, DESCRIPTION_MAX)}
                  </p>
                </div>
              </div>
            </>,
          )}

          {step(
            2,
            <>
              <div className={styles.payGrid}>
                {(["from", "to"] as const).map((end) => {
                  const key = end === "from" ? "payFrom" : "payTo";
                  const invalid = end === "to" && Boolean(errors.payRange);
                  return (
                    <div key={end} className={styles.field}>
                      <label className={styles.label} htmlFor={field(end)}>
                        {end === "from" ? L.payFrom : L.payTo}
                      </label>
                      <HireMeMaskedInput
                        id={field(end)}
                        size="large"
                        inputMode="decimal"
                        autoComplete="off"
                        invalid={invalid}
                        aria-describedby={describedBy(
                          field("pay-unit"),
                          invalid && field("payRange-error"),
                        )}
                        value={draft[key]}
                        ghost={moneyGhost(
                          draft[key],
                          L.payTemplates[draft.period],
                        )}
                        onChange={(event) =>
                          set(key, masked(event, formatMoney))
                        }
                        lead={
                          <span className={styles.moneyMark} aria-hidden="true">
                            {currency?.mark}
                          </span>
                        }
                        trail={
                          <span aria-hidden="true">
                            / {L.periods[draft.period]}
                          </span>
                        }
                      />
                      {end === "to" && errorFor("payRange")}
                    </div>
                  );
                })}
                <p id={field("pay-unit")} hidden>
                  {currency?.label}, {L.period} {L.periods[draft.period]}
                </p>
                <HireMeSelect
                  label={L.currency}
                  options={CURRENCIES}
                  value={draft.currency}
                  onChange={(value) => set("currency", value)}
                />
                <HireMeSegmented
                  name={field("period")}
                  label={L.period}
                  options={L.periods}
                  value={draft.period}
                  onChange={(value: PayPeriod) => {
                    setPeriodChosen(true);
                    set("period", value);
                  }}
                />
              </div>

              <fieldset className={styles.benefits}>
                <legend className={styles.label}>{L.benefitsLabel}</legend>
                <p className={styles.hint}>{L.benefitsHint}</p>
                <ul className={styles.benefitList}>
                  {BENEFITS.map((benefit) => {
                    const on = benefit.id in draft.benefits;
                    return (
                      <li
                        key={benefit.id}
                        className={styles.benefit}
                        data-on={on ? "" : undefined}
                      >
                        <label className={styles.benefitToggle}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggleBenefit(benefit.id)}
                          />
                          <span className={styles.check} aria-hidden="true" />
                          {benefit.label}
                        </label>
                        {on && (
                          <div className={styles.benefitDetails}>
                            <label
                              className={styles.detailLabel}
                              htmlFor={field(`benefit-${benefit.id}`)}
                            >
                              {L.benefitDetail}{" "}
                              <span className={styles.optional}>
                                ({L.optional})
                              </span>
                            </label>
                            <input
                              id={field(`benefit-${benefit.id}`)}
                              className={styles.benefitDetail}
                              type="text"
                              aria-describedby={field(
                                `benefit-${benefit.id}-hint`,
                              )}
                              value={draft.benefits[benefit.id] ?? ""}
                              onChange={(event) =>
                                set("benefits", {
                                  ...draft.benefits,
                                  [benefit.id]: event.target.value,
                                })
                              }
                            />
                            <p
                              id={field(`benefit-${benefit.id}-hint`)}
                              className={styles.hint}
                            >
                              {benefit.detail}
                            </p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className={styles.field}>
                  <label
                    className={styles.label}
                    htmlFor={field("other-benefits")}
                  >
                    {L.otherBenefits}{" "}
                    <span className={styles.optional}>({L.optional})</span>
                  </label>
                  <input
                    id={field("other-benefits")}
                    className={styles.input}
                    type="text"
                    value={draft.otherBenefits}
                    onChange={(event) =>
                      set("otherBenefits", event.target.value)
                    }
                  />
                </div>
              </fieldset>
            </>,
          )}

          <HireMeSkills
            step={L.stepNumber(4)}
            chosen={draft.skills}
            others={draft.otherSkills}
            onToggle={(skillId) =>
              set(
                "skills",
                draft.skills.includes(skillId)
                  ? draft.skills.filter((one) => one !== skillId)
                  : [...draft.skills, skillId],
              )
            }
            onAddOther={(name) =>
              set("otherSkills", [...draft.otherSkills, name])
            }
            onRemoveOther={(name) =>
              set(
                "otherSkills",
                draft.otherSkills.filter((one) => one !== name),
              )
            }
          />

          {step(
            4,
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={field("name")}>
                  {L.name}{" "}
                  <span className={styles.requiredMark}>({L.required})</span>
                </label>
                <input
                  id={field("name")}
                  className={styles.input}
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy(
                    Boolean(errors.name) && field("name-error"),
                  )}
                  value={draft.name}
                  onChange={(event) => set("name", event.target.value)}
                />
                {errorFor("name")}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={field("email")}>
                  {L.email}{" "}
                  <span className={styles.requiredMark}>({L.required})</span>
                </label>
                <input
                  id={field("email")}
                  className={styles.input}
                  type="email"
                  inputMode="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy(
                    Boolean(errors.email) && field("email-error"),
                  )}
                  value={draft.email}
                  onChange={(event) => set("email", event.target.value)}
                />
                {errorFor("email")}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={field("phone")}>
                  {L.phone}{" "}
                  <span className={styles.optional}>({L.optional})</span>
                </label>
                <HireMeMaskedInput
                  id={field("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-describedby={field("phone-hint")}
                  value={draft.phone}
                  ghost={phoneGhost(draft.phone)}
                  onChange={(event) => set("phone", masked(event, formatPhone))}
                />
                <p id={field("phone-hint")} className={styles.hint}>
                  {L.phoneHint}
                </p>
              </div>
              <div className={`${styles.field} ${styles.wide}`}>
                <label className={styles.label} htmlFor={field("note")}>
                  {L.note}{" "}
                  <span className={styles.optional}>({L.optional})</span>
                </label>
                <textarea
                  id={field("note")}
                  className={`${styles.input} ${styles.textarea} ${styles.short}`}
                  rows={3}
                  maxLength={NOTE_MAX}
                  aria-describedby={`${field("note-hint")} ${field("note-count")}`}
                  value={draft.note}
                  onChange={(event) => set("note", event.target.value)}
                />
                <div className={styles.under}>
                  <p id={field("note-hint")} className={styles.hint}>
                    {L.noteHint}
                  </p>
                  <p id={field("note-count")} className={styles.count}>
                    {L.characters(draft.note.length, NOTE_MAX)}
                  </p>
                </div>
              </div>
            </div>,
          )}

          {/* For bots only: people never see or reach it; the script drops any offer
              that fills it in. */}
          <div className={styles.trap} aria-hidden="true">
            <label htmlFor={field("website")}>{L.trap}</label>
            <input
              id={field("website")}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(event) => setTrap(event.target.value)}
            />
          </div>
        </div>

        <footer className={styles.footer}>
          {status === "sent" ? (
            <div className={styles.actions}>
              <button type="button" className={styles.send} onClick={close}>
                {L.close}
              </button>
            </div>
          ) : (
            <>
              <div className={styles.meters}>
                <HireMeChance chance={chance} />
                <HireMeFit
                  inStack={draft.skills.length}
                  outside={draft.otherSkills.length}
                />
              </div>
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.send}
                  aria-disabled={status === "sending"}
                >
                  {status === "sending" ? L.sending : L.send}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </>
          )}
          {status !== "sent" && <p className={styles.privacy}>{L.privacy}</p>}
          <p className={styles.status} role="status">
            {status === "opened" && L.openedEmail}
            {status === "failed" && (
              <>
                {L.failed} <a href={`mailto:${HIRE_ME_TO}`}>{HIRE_ME_TO}</a>.
              </>
            )}
          </p>
        </footer>
      </form>
    </dialog>
  );
}

export default HireMe;
