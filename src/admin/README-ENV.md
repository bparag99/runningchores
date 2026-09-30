# Environment & Google Meet Setup — `/admin`

Complete reference for every environment variable this app reads, and the full
Google Calendar / Meet configuration needed to leave Demo Mode.

---

## 1. Variables at a glance

| Variable                 | Required | Secret? | Purpose                                                       |
| ------------------------ | -------- | ------- | ------------------------------------------------------------- |
| `PASSWORD`               | Yes      | See §2  | Admin sign-in password, verified at login                     |
| `VITE_ADMIN_USER_ID`     | No       | No      | Admin user id. Defaults to `admin`                            |
| `VITE_ADMIN_EMAIL`       | No       | No      | Google account that organises meetings. Defaults to `runningchores@gmail.com` |
| `VITE_GOOGLE_CLIENT_ID`  | Yes¹     | No      | Google OAuth 2.0 **Web application** client id                |

> **There is deliberately no `VITE_GOOGLE_API_KEY`.** A Google API key only
> *identifies the project* (for quota and billing) — it cannot authorise access
> to a user's calendar. Every Calendar call here is made with an OAuth
> `Authorization: Bearer <access_token>` obtained by signing in, so an API key
> would be redundant. If you later use the Google Maps JavaScript API, *that* is
> a case where an API key is genuinely required.

¹ Only if you want real meetings. Without it the app runs in **Demo Mode** (§6).

Where to set them:

- **Local** — a `.env` file in the repo root (`Vite` reads `envDir` = root).
  Copy `.env.example` → `.env`. Add `.env` to `.gitignore` (already covered).
- **Vercel / Netlify / CI** — Project Settings → Environment Variables.
  **Rebuild the deployment after adding a variable.** Vite inlines env values
  at build time, so changing a variable without a rebuild has no effect.

---

## 2. `PASSWORD` — admin sign-in

```dotenv
PASSWORD=your-strong-password-here
```

- The login form accepts any user id matching `VITE_ADMIN_USER_ID` (default
  `admin`) and a password that must equal `PASSWORD`.
- Comparison is length-independent (`safeEqual` in `src/admin/services/auth.ts`).
- If `PASSWORD` is unset, the app falls back to `admin123` so it still runs
  locally, and the login screen shows a warning that no secret is configured.
  **Set a real `PASSWORD` in every deployed environment.**
- The signed-in session is stored in `localStorage` under
  `rc.employee-portal.session`, so a refresh keeps you signed in.

> ### ⚠️ This is not true server-side security
> Any value Vite exposes is **compiled into the client JavaScript bundle** and is
> readable by anyone who loads the page (View Source → the bundle, or DevTools →
> Sources). `PASSWORD` stops casual access; it does **not** stop a determined
> user. True authentication requires a server or an identity provider. The
> `AuthProvider` interface in `src/admin/services/auth.ts` exists so you can swap
> in a real provider later without touching any UI component.

---

## 3. Google Calendar + Meet — full setup

The portal creates a Google Calendar event (organizer
`runningchores@gmail.com`) with a Google Meet conference, and adds the selected
employee as an attendee. This is done **entirely from the browser** using
Google Identity Services (GIS) and the Calendar `events.insert` endpoint with
`conferenceData.createRequest`.

### Step 1 — Create a Google Cloud project

1. Go to <https://console.cloud.google.com/projectcreate>.
2. Create/select a project (e.g. `runningchores-admin`).
3. Note the **Project ID**.

### Step 2 — Enable the Google Calendar API

1. **APIs & Services → Library**.
2. Search **Google Calendar API** → **Enable**.
   (You do **not** need the Google Meet API or the Drive API.)

### Step 3 — Configure the OAuth consent screen

1. **APIs & Services → OAuth consent screen**.
2. Choose **External** (internal Google Workspace accounts can use *Internal*).
3. Fill in App name, Support email, Developer contact email → **Save and Continue**.
4. On the **Scopes** page, click **Add or remove scopes** and add exactly:
   ```text
   https://www.googleapis.com/auth/calendar.events
   ```
   This is the only scope the app requests (create/modify events). No Drive,
   no Gmail read/send scope.
5. Add your own Google account under **Test users** while the app is in
   *Testing* status (so you can authorise before publishing).

### Step 3b — Add yourself as a Test user (required while in Testing)

If the consent screen is in **Testing** status, Google only allows **approved
test users** to authorise. Any other Google account gets:

```text
Access blocked: <App name> has not completed the Google verification process
Error 403: access_denied
```

This is expected — it is not a bug in the app.

1. **APIs & Services → OAuth consent screen**.
2. Scroll to **Test users** → **Add users**.
3. Add the Google account that will own the calendar, e.g.
   `runningchores@gmail.com`.
4. Click **Add**. The change is immediate — no need to redeploy.

There is a cap of 100 test users, which is plenty for an internal tool.

> **Longer term:** once the portal is only used by your own organisation, publish
> the consent screen (**Publish app**). If you are on Google Workspace you can
> instead set the app type to **Internal**, which skips Google's verification
> process entirely. Publishing an app that requests the sensitive
> `calendar.events` scope to the general public does require Google
> verification.

### Step 4 — Create the OAuth client (Web application)

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. **Application type: Web application.**
   - **Not** "Desktop app" and **not** "Service account" — the app runs in a
     browser tab.
3. **Name:** e.g. `RunningChores Admin Web`.
4. Under **Authorised JavaScript origins**, add every origin the app is served
   from, e.g.:
   ```text
   http://localhost:5173
   http://localhost:5174
   https://your-app.vercel.app
   https://yourdomain.com
   ```
   (No trailing slash, no `/admin` path, no `www` unless that is the real origin.)
5. **Authorised redirect URIs** is **not** required — the app uses the GIS
   popup/token flow, not the redirect (code) flow. Leave it empty.
6. Click **Create**, then copy the **Client ID**.

> Do **not** create or download a service-account key, and never place a client
> secret, private key, or Gmail password anywhere in this app.

### Step 5 — Add the Client ID to your environment

```dotenv
VITE_GOOGLE_CLIENT_ID=593912007281-gb7521l1ffb91mkjgthufgofu3aj4dqr.apps.googleusercontent.com
```

- The client id is **public** (it ships in the browser) — that is normal and
  safe for a "Web application" client.
- **Never put `client_secret` in this file.** The downloaded
  `client_secret_*.json` also contains a client secret, but a browser-side GIS
  token flow does not use it. If you put it in a `VITE_`/`PASSWORD`-prefixed
  variable it would be compiled into the public bundle and leaked to every
  visitor. Rotate the secret in Google Cloud if it has been exposed.
- Restart the dev server / rebuild the deployment after setting it.

**Authorised JavaScript origins currently registered for this client** (from the
downloaded client JSON):

```text
https://runningchores-jge3hachn-bparag99s-projects.vercel.app
https://www.runningchores.com
```

> **Local development will fail with `origin_mismatch` until you add your local
> origin.** In Google Cloud → Credentials → your Web client → Authorised
> JavaScript origins, add `http://localhost:5173` (and `http://localhost:5174`
> if 5173 is taken), with no trailing slash and no path.

### Step 5b — Set the admin (organizer) email

```dotenv
VITE_ADMIN_EMAIL=runningchores@gmail.com
```

This is the account that **owns the Calendar** the event is written to. It is
shown in the Create Meeting dialog and on the Settings page. If it is not set,
the app falls back to `runningchores@gmail.com`.

### Step 6 — First sign-in

1. Open `/admin` and sign in. The app immediately connects to Google in the
   background — **one** sign-in popup appears here, at login.
2. Approve the `calendar.events` consent. The header badge changes to
   **"Google: Connected"**.
3. From then on, **Create Meeting opens the dialog directly** — no popup. The
   access token is cached in `sessionStorage` for its lifetime (about one hour),
   then Google is re-consulted silently.

If the badge ever shows **"Google: Connect"**, click it to reconnect.

Notes on the token:

- It is stored in `sessionStorage`, so it dies when the tab closes and is never
  written to disk or shared between tabs.
- It is readable by any script on the page, so it is a **usability cache, not a
  security boundary**. The real protection is the OAuth consent itself.
- There is deliberately no way to skip the first consent without a backend —
  see "Why a sign-in popup is unavoidable" below.

### Why a sign-in popup is unavoidable

No Google API key can remove it. An API key identifies a *project* for quota
and billing; it cannot authorise access to a specific user's calendar. Creating
an event with an attendee writes into one person's calendar and emails them, so
it can only be done with a token obtained by that user signing in.

| Approach                                | Popup | Event owner          | Employee gets calendar invite |
| --------------------------------------- | ----- | -------------------- | ---------------------------- |
| **OAuth (current)**                     | Once/hour | `runningchores@gmail.com` | **Yes**                |
| Service account                         | Never | service account      | No — manual link only         |
| Service account + domain-wide delegation| Never | `runningchores@gmail.com` | Yes — but needs a **backend** to hold the private key |

A service-account private key must never ship in a browser bundle, so the
zero-popup options both require a small server-side component. If the one
popup per hour is acceptable, the current frontend-only design is the right
trade-off.

### Step 7 — Verify

- The header badge should read **“Google: Connected”** (green) after signing in.
  If it shows **“Google: Connect”**, click it to re-authorise.
- Creating a meeting returns a real `meet.google.com/...` link and sends a
  calendar invitation to the employee.

---

## 4. How the meeting is created (reference)

`POST https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`

- Auth: `Authorization: Bearer <access_token>` (in memory).
- Body highlights:
  - `summary` = meeting title
  - `description` = meeting description
  - `start` / `end` = `{ dateTime, timeZone }`
  - `attendees: [{ email: <employee> }]`
  - `conferenceData.createRequest` = `{ requestId, conferenceSolutionKey: { type: 'hangoutsMeet' } }`
- Response `hangoutLink` becomes the Meet URL. If a live response is missing
  `hangoutLink`, the app treats it as a **failure** and never shows success.

---

## 5. Troubleshooting

| Symptom                                                   | Cause / fix                                                                                   |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Header shows **Demo Mode**                                 | `VITE_GOOGLE_CLIENT_ID` empty or not set at build time. Set it and rebuild.                     |
| `redirect_uri_mismatch`                                    | You used a Desktop/Service-account client. Use a **Web application** client.                   |
| `origin_mismatch` / popup closes immediately                | Current origin missing from **Authorised JavaScript origins**. Add the exact origin (e.g. `http://localhost:5173`). |
| `Access blocked` / `app is not verified`                    | Consent screen in *Testing* and the signing-in account is not a **test user** (see Step 3b), or the app is unpublished. |
| Popup blocked by browser                                   | Allow popups for the site; the app shows a clear error rather than pretending success.          |
| `insufficientPermissions` / 403                            | Consent screen not published and/or the `calendar.events` scope missing. Re-check Steps 3–4.   |
| Meeting creates but no Meet link                            | Google sometimes needs a moment; the app raises an error rather than faking a link.             |
| Login says wrong password                                  | `PASSWORD` changed without a rebuild, or the trailing/leading space differs. Rebuild and retry.  |
| Events land in the wrong calendar                           | Sign in with the account you actually want as organizer, and set `VITE_ADMIN_EMAIL` to match (defaults to `runningchores@gmail.com`). |

---

## 6. Demo Mode (no Google config)

If `VITE_GOOGLE_CLIENT_ID` is not set, the app runs in **Demo Mode**:

- The header shows an amber **“Google Integration: Demo Mode”** badge.
- Meetings are simulated: a fake `meet.google.com/demo-…` link is generated and
  the record is tagged **Demo** in the meeting history.
- The success dialog states clearly that **no real calendar event was created**.

This lets you exercise the entire UI (add employee → create meeting → share on
WhatsApp) without any Google setup.
