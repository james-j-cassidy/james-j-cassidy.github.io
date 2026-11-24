# Hire Me offers → Google Sheet

The site's Hire Me form sends each offer to a small Google Apps Script. The script adds
the offer as a row in a Google Sheet and emails you a short notice; replying to that
notice answers the sender. It is free, and nothing in it can run up a bill: Google's
daily limits are caps, not charges.

`Code.gs` holds no secrets. The Sheet is the one the script is bound to, and the notice
goes to the account that deploys it.

## Set it up (about 10 minutes)

Do every step in **Chrome**, signed in to your **personal** Google account
(cassidy.james.j@gmail.com), never the work account.

1. Go to <https://sheets.new>. Name the new sheet **Hire Me offers**.
2. In the sheet: **Extensions → Apps Script**. A script editor opens.
3. Delete everything in `Code.gs` and paste in the contents of
   [`Code.gs`](./Code.gs). Click **Save** (the disk icon).
4. In the function list at the top, choose **setup**, then click **Run**.
   - Google asks you to authorize the script: **Review permissions** → choose your
     personal account.
   - It warns that Google hasn't verified the app (it's your own script): click
     **Advanced → Go to (your project name) (unsafe)** → **Allow**.
   - The sheet now has a bold header row.
5. Click **Deploy → New deployment**.
   - **Select type** (gear icon) → **Web app**.
   - **Description:** Hire Me form.
   - **Execute as:** Me.
   - **Who has access:** Anyone.
   - Click **Deploy**, and authorize again if asked.
6. Copy the **Web app URL** (it ends in `/exec`) and give it to Claude. It goes into
   `HIRE_ME_ENDPOINT` in `src/content/hireMe.ts`.

## Changing the script later

Edit `Code.gs` here, paste it into the editor again, then **Deploy → Manage deployments
→ (the deployment) → Edit (pencil) → Version: New version → Deploy**. The URL stays
the same.

## What the script does

- Ignores bots: a hidden field people never fill, and forms filled in under 3 seconds,
  are answered "ok" and kept nowhere.
- Checks a job title, a name and a valid email are present.
- Stores every field as plain text, cut to a sensible length; a value starting with
  `=`, `+`, `-` or `@` is escaped so the Sheet never runs it as a formula.
- Writes one row at a time (a lock), then emails you the offer.
