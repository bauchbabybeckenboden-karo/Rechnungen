# Rechnung – Bauch Baby Beckenboden

## Einrichtung (einmalig, ~15 Minuten)

### 1. Resend-Konto & Domain einrichten
1. Gehe zu resend.com → kostenloses Konto erstellen
2. Unter "Domains" → "Add Domain" → `bauch-baby-beckenboden.com` eingeben
3. Resend zeigt dir DNS-Einträge → diese bei IONOS hinterlegen:
   - In IONOS unter "Domains & SSL" → "DNS" → Einträge eintragen
   - Ca. 10–30 Min bis zur Aktivierung
4. Unter "API Keys" → neuen Key erstellen → kopieren

### 2. GitHub Repository
1. github.com → "New repository" → Name z.B. `bbb-rechnung`
2. Diesen Ordner hochladen (alle Dateien)

### 3. Netlify mit GitHub verbinden
1. netlify.com → "Add new site" → "Import from Git" → GitHub wählen
2. Repository auswählen → Deploy

### 4. Resend API Key in Netlify hinterlegen
1. In Netlify: Site Settings → Environment Variables
2. Neue Variable: `RESEND_API_KEY` = dein Key aus Schritt 1
3. Deploy neu starten

### Fertig! 🎉
Die App läuft jetzt unter deiner Netlify-URL.
Du kannst sie auch mit deiner eigenen Domain verbinden (Netlify → Domain Settings).

## Was passiert beim E-Mail-Versand?
- Kundin bekommt: E-Mail mit Rechnungsdetails von kontakt@bauch-baby-beckenboden.com
- Du bekommst: automatisch eine Kopie (BCC) an dieselbe Adresse
- Absender erscheint als: "Karoline Hartwig <kontakt@bauch-baby-beckenboden.com>"
