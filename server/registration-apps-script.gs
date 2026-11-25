/**
 * ESC membership registration endpoint (Google Apps Script).
 * Saves each registration as a row in a PRIVATE Google Sheet owned by the committee.
 *
 * Setup (see README, "Connect the membership form"):
 * 1. Create a Google Sheet, e.g. "ESC Registrations". Keep it private.
 * 2. Extensions → Apps Script. Paste this file. Save.
 * 3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 * 4. Copy the web app URL into src/config.js → REGISTRATION_ENDPOINT.
 */

const HEADERS = ['Submitted at', 'Full name', 'Email', 'Institution', 'Programme', 'Year of study', 'Interests'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return out({ ok: true }); // spam trap filled in: ignore silently

    const required = ['fullName', 'email', 'institution', 'programme', 'yearOfStudy'];
    for (const k of required) {
      if (!d[k] || String(d[k]).trim() === '') return out({ ok: false, error: 'Missing ' + k });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return out({ ok: false, error: 'Invalid email' });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    const clean = (v) => String(v || '').slice(0, 300).replace(/^[=+\-@]/, "'$&"); // block formula injection
    sheet.appendRow([
      new Date(),
      clean(d.fullName), clean(d.email), clean(d.institution), clean(d.programme), clean(d.yearOfStudy),
      clean((d.interests || []).join(', ')),
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: 'Server error' });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
