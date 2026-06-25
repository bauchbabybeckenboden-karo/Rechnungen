exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ABSENDER = 'kontakt@bauch-baby-beckenboden.com';

  let data;
  try { data = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Ungültige Daten' }) }; }

  const { to, name, rechnungsNr, datum, positionen, gesamt } = data;

  // Tabellenzeilen für alle Positionen
  const zeilen = positionen.map(p => `
    <tr>
      <td style="padding:6px 10px;border-top:1px solid #f7f0ee;font-size:13px;color:#2c2c2c;">${p.dl}</td>
      <td style="padding:6px 10px;border-top:1px solid #f7f0ee;font-size:13px;color:#2c2c2c;text-align:right;">${p.menge}</td>
      <td style="padding:6px 10px;border-top:1px solid #f7f0ee;font-size:13px;color:#2c2c2c;text-align:right;">${p.preis}</td>
      <td style="padding:6px 10px;border-top:1px solid #f7f0ee;font-size:13px;color:#2c2c2c;text-align:right;">${p.gesamt}</td>
    </tr>`).join('');

  const emailHTML = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ede9;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede9;padding:32px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:white;">
  <tr><td style="background:#9e6b64;padding:24px 36px;">
    <p style="margin:0;color:white;font-size:28px;font-style:italic;">Rechnung</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:11px;line-height:1.6;">
      Bauch Baby Beckenboden &middot; Mamafit &middot; Schwangerfit &middot; Trageberatung &middot; Somatic Yoga
    </p>
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 6px;font-size:14px;color:#4a4a4a;">Liebe ${name.split(' ')[0]},</p>
    <p style="margin:0 0 24px;font-size:14px;color:#4a4a4a;line-height:1.6;">vielen Dank! Anbei deine Rechnung.</p>

    <p style="margin:0 0 8px;font-size:11px;color:#9e6b64;letter-spacing:1px;text-transform:uppercase;">
      Rechnung ${rechnungsNr} &middot; ${datum}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr style="background:#9e6b64;">
        <th style="padding:7px 10px;text-align:left;color:white;font-size:11px;font-weight:400;">Dienstleistung</th>
        <th style="padding:7px 10px;text-align:right;color:white;font-size:11px;font-weight:400;">Menge</th>
        <th style="padding:7px 10px;text-align:right;color:white;font-size:11px;font-weight:400;">Preis/St.</th>
        <th style="padding:7px 10px;text-align:right;color:white;font-size:11px;font-weight:400;">Gesamt</th>
      </tr>
      ${zeilen}
      <tr>
        <td colspan="2"></td>
        <td style="padding:8px 10px;border-top:2px solid #9e6b64;border-bottom:2px solid #9e6b64;font-size:13px;font-weight:bold;color:#2c2c2c;text-align:right;">Gesamt</td>
        <td style="padding:8px 10px;border-top:2px solid #9e6b64;border-bottom:2px solid #9e6b64;font-size:14px;font-weight:bold;color:#9e6b64;text-align:right;">${gesamt}</td>
      </tr>
    </table>

    <p style="font-size:11px;color:#999;font-style:italic;margin:0 0 24px;">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>
    <p style="font-size:13px;color:#4a4a4a;margin:0 0 4px;">Bitte überweise den Betrag auf:</p>
    <p style="font-size:12px;color:#666;line-height:1.9;margin:0 0 28px;">
      IBAN: DE08500090500000055914<br>
      BIC: GENODEF1S12 &middot; Karoline Hartwig<br>
      Verwendungszweck: ${rechnungsNr}
    </p>
    <p style="font-size:14px;color:#4a4a4a;margin:0 0 2px;">Mit freundlichen Grüßen</p>
    <p style="font-size:24px;color:#2c2c2c;margin:4px 0 2px;font-style:italic;">Karoline Hartwig</p>
    <p style="font-size:11px;color:#888;margin:0;">Bauch Baby Beckenboden</p>
  </td></tr>
  <tr><td style="background:#f7f0ee;padding:14px 36px;border-top:1px solid #9e6b64;">
    <p style="margin:0;font-size:10px;color:#888;line-height:1.8;">
      Bauch Baby Beckenboden &middot; Heinrich-Bertelmann-Str. 12 &middot; 34121 Kassel<br>
      0176 87127535 &middot; kontakt@bauch-baby-beckenboden.com &middot; www.bauch-baby-beckenboden.de
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Karoline Hartwig <${ABSENDER}>`,
        to: [to],
        bcc: [ABSENDER],
        reply_to: ABSENDER,
        subject: `Deine Rechnung ${rechnungsNr} – Bauch Baby Beckenboden`,
        html: emailHTML,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: result.message || 'Resend Fehler' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
