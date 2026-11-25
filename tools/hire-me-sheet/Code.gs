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
  "Note",
];

// Longest text kept per field; anything longer is cut.
const SHORT = 200;
const LONG = 4000;
const NOTE = 500;

// A form filled faster than this is a bot; it is told "ok" and nothing is kept.
const MIN_FILL_MS = 3000;

// The largest body accepted, and the most items kept from each list.
const MAX_BODY = 20000;
const MAX_ITEMS = 30;
const ITEM = 60;

// The only values the form's choices can send.
const CHOICES = {
  engagement: ["full-time", "contract", "consulting"],
  workPlace: ["remote", "hybrid", "on-site"],
  currency: ["USD", "CAD", "EUR", "GBP", "AUD"],
  period: ["year", "hour"],
};

// Flood limits. The script never sees who is sending, so the limits are for everyone:
// at most this many offers a minute, and this many notice emails a day (offers past
// that are still saved, just not emailed). The same email can send once in 10 minutes.
const PER_MINUTE = 5;
const EMAILS_PER_DAY = 40;
const REPEAT_SECONDS = 600;

/** Run once from the editor: writes the header row and freezes it. */
function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet
    .getRange(1, 1, 1, COLUMNS.length)
    .setValues([COLUMNS])
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
  // Every cell plain text, so nothing a sender types is read as a formula or date.
  sheet.getRange(1, 1, sheet.getMaxRows(), COLUMNS.length).setNumberFormat("@");
}

/** Receives one offer from the site. */
function doPost(e) {
  try {
    const body = (e && e.postData && e.postData.contents) || "";
    if (body.length > MAX_BODY) return reply({ ok: false, error: "missing" });
    const offer = JSON.parse(body || "{}");

    // Bots: a filled trap field, or a form filled too fast (or with no time at all).
    // Answer "ok", keep nothing.
    const elapsed = Number(offer.elapsed);
    if (offer.website || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS)
      return reply({ ok: true });

    const cache = CacheService.getScriptCache();
    const minute = "minute-" + Math.floor(Date.now() / 60000);
    const sentThisMinute = Number(cache.get(minute) || 0);
    if (sentThisMinute >= PER_MINUTE)
      return reply({ ok: false, error: "busy" });
    cache.put(minute, String(sentThisMinute + 1), 120);

    const jobTitle = text(offer.jobTitle, SHORT);
    const name = text(offer.name, SHORT);
    const email = text(offer.email, SHORT);
    if (!jobTitle || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ ok: false, error: "missing" });
    }
    for (const key in CHOICES) {
      if (CHOICES[key].indexOf(offer[key]) < 0) {
        return reply({ ok: false, error: "missing" });
      }
    }

    // The same sender again within 10 minutes: already received, nothing more kept.
    const repeat = "from-" + email.toLowerCase();
    if (cache.get(repeat)) return reply({ ok: true });
    cache.put(repeat, "1", REPEAT_SECONDS);

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
      list(offer.benefits, SHORT)
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
      text(offer.note, NOTE),
    ];

    // One writer at a time, so two offers never land on the same row.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // The offer is saved; a failed or skipped notice never turns it into an error.
    const today = "emails-" + new Date().toISOString().slice(0, 10);
    const emailed = Number(cache.get(today) || 0);
    if (emailed < EMAILS_PER_DAY) {
      try {
        notify(row, email);
        cache.put(today, String(emailed + 1), 86400);
      } catch (error) {
        // The row is in the Sheet; only the notice is missed.
      }
    }
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
  const oneLine = function (value) {
    return String(value).replace(/[\r\n]+/g, " ");
  };
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    replyTo: oneLine(replyTo).slice(0, 254),
    subject: oneLine(
      "[Site form] New offer: " + row[2] + (row[3] ? " at " + row[3] : ""),
    ),
    body:
      "Links below come from the sender; treat them as untrusted.\n\n" +
      lines.join("\n"),
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

/** A list of short entries, each plain text, at most MAX_ITEMS of them. */
function list(value, max) {
  return (Array.isArray(value) ? value : [])
    .slice(0, MAX_ITEMS)
    .map(function (item) {
      return text(item, max || ITEM);
    })
    .filter(Boolean);
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
