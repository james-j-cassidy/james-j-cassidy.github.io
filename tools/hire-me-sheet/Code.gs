/**
 * @OnlyCurrentDoc
 * Limits the script to the one Sheet it is bound to (not all of your spreadsheets).
 */

/**
 * Hire Me offers → this Google Sheet (and a short notice to the Sheet's owner).
 *
 * A Google Apps Script bound to the Sheet that holds the offers. Deployed as a web app
 * ("Execute as: Me", "Who has access: Anyone"), it receives the site's Hire Me form,
 * adds one row per offer and emails the owner a notice whose Reply-To is the sender.
 * It holds no secrets: the Sheet is the one it is bound to, and the notice goes to the
 * account that deployed it. See README.md for the setup steps.
 */

// The columns, in order. setup() writes them as the header row.
const COLUMNS = [
  "Received",
  "Kind of work",
  "Job title",
  "Company",
  "Where",
  "Location",
  "Start",
  "Pay from",
  "Pay to",
  "Currency",
  "Per",
  "Benefits",
  "Skills in stack",
  "Skills outside",
  "Fit %",
  "Chance shown %",
  "About the role",
  "Name",
  "Email",
  "Phone",
];

// Longest text kept per field; anything longer is cut.
const SHORT = 200;
const LONG = 4000;

// A form filled faster than this is a bot; it is told "ok" and nothing is kept.
const MIN_FILL_MS = 3000;

/** Run once from the editor: writes the header row and freezes it. */
function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet
    .getRange(1, 1, 1, COLUMNS.length)
    .setValues([COLUMNS])
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
}

/** Receives one offer from the site. */
function doPost(e) {
  try {
    const offer = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Bots: a filled trap field, or a form filled too fast. Answer "ok", keep nothing.
    if (offer.website || Number(offer.elapsed) < MIN_FILL_MS)
      return reply({ ok: true });

    const jobTitle = text(offer.jobTitle, SHORT);
    const name = text(offer.name, SHORT);
    const email = text(offer.email, SHORT);
    if (!jobTitle || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ ok: false, error: "missing" });
    }

    const skills = list(offer.skills);
    const otherSkills = list(offer.otherSkills);
    const total = skills.length + otherSkills.length;
    const fit = total ? Math.round((skills.length / total) * 100) : "";

    const row = [
      new Date(),
      text(offer.engagement, SHORT),
      jobTitle,
      text(offer.company, SHORT),
      text(offer.workPlace, SHORT),
      text(offer.location, SHORT),
      text(offer.start, SHORT),
      text(offer.payFrom, SHORT),
      text(offer.payTo, SHORT),
      text(offer.currency, SHORT),
      text(offer.period, SHORT),
      list(offer.benefits)
        .concat(text(offer.otherBenefits, LONG) || [])
        .join("; "),
      skills.join(", "),
      otherSkills.join(", "),
      fit,
      Number.isFinite(Number(offer.chance)) ? Number(offer.chance) : "",
      text(offer.description, LONG),
      name,
      email,
      text(offer.phone, SHORT),
    ];

    // One writer at a time, so two offers never land on the same row.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(row);
    } finally {
      lock.releaseLock();
    }

    notify(row, email);
    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: "server" });
  }
}

/** A short notice to the owner; replying answers the sender. */
function notify(row, replyTo) {
  const lines = COLUMNS.map(function (column, index) {
    return column + ": " + row[index];
  });
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    replyTo: replyTo,
    subject: "New offer: " + row[2] + (row[3] ? " at " + row[3] : ""),
    body: lines.join("\n"),
  });
}

/**
 * A field as plain text: trimmed, cut to a length, and never read by the Sheet as a
 * formula (a leading =, +, - or @ is escaped with an apostrophe).
 */
function text(value, max) {
  const clean = String(value == null ? "" : value)
    .trim()
    .slice(0, max);
  return /^[=+\-@]/.test(clean) ? "'" + clean : clean;
}

/** A list of skill names, each plain text, at most 60 of them. */
function list(value) {
  return (Array.isArray(value) ? value : [])
    .slice(0, 60)
    .map(function (item) {
      return text(item, SHORT);
    })
    .filter(Boolean);
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
