# Employee Management & Google Meet Admin Portal — Design

**Feature folder:** `src/admin/`
**Entry route:** `/admin`
**Status:** Approved design (implementation follows this document)
**Scope:** Frontend-only internal utility for Running Chores administrators.
**Env setup guide:** `src/admin/README-ENV.md`

---

## 1. Goal

Build a single, fast, professional admin utility that supports one workflow end to end:

```text
LOGIN
  ↓
EMPLOYEE LIST
  ↓
CREATE MEETING
  ↓
SELECT EMPLOYEE
  ↓
CREATE GOOGLE MEET
  ↓
✓ MEETING CREATED
  ↓
SHARE ON WHATSAPP
```

Deliberately **out of scope**: dashboard charts, analytics, CRM features, billing,
inventories, and any other module not named in the journey above.

---

## 2. Hard Constraints

| # | Constraint | Design response |
|---|------------|-----------------|
| C1 | No custom backend of any kind | All state in the browser (`localStorage` + React state). No Express, no Spring, no REST server, no database. |
| C2 | No Gmail password, service-account private key, or client secret in the app | Only a public OAuth **client id** (`VITE_GOOGLE_CLIENT_ID`). No API key is used — an API key cannot authorise calendar access; OAuth does. The access token lives in memory only, never in `localStorage`. |
| C3 | Never fake success | If the Google API call fails, show an error. A Meet link is only rendered when the API actually returned one (or when Demo Mode is explicitly on and labelled). |
| C4 | Cannot silently send WhatsApp messages | `wa.me` deep link only. The admin always taps send in WhatsApp. |
| C5 | Must not create a second React root / Vite app / router | Registers routes in the existing `src/router.tsx` registry. Feature folder only. |
| C6 | Integration code must be swappable | Google and WhatsApp logic live in `services/`, never inside UI components. |

---

## 3. Routing Design

The repository already owns a single route registry in `src/router.tsx`
(`routes`, `getRoute`, `navigate`). Per the repo's non-negotiable rules we
**extend that registry rather than mounting a second router**.

This is a **real application route, not a portfolio wireframe**, so every portal
route is flagged `internal: true` and is omitted from the `/portfolio` listing.
It is reached by navigating directly to `/admin`.

Four paths are registered; all four render the same feature entry component
`<EmployeePortalApp />`. The feature reads `window.location.pathname` and maps
it to an internal view, so the URLs in the spec are real and the browser
back/forward button works.

| Route id    | Path               | View     | Listed on `/portfolio` |
| ----------- | ------------------ | -------- | ---------------------- |
| `admin`     | `/admin`           | Admin    | No (internal)          |
| `admin-login` | `/login`        | Login    | No (internal)          |
| `admin-meetings` | `/admin/meetings` | Meetings | No (internal)   |
| `admin-settings` | `/admin/settings` | Settings | No (internal)   |

`Route` gains an optional `internal?: boolean` flag; `projectRoutes` filters it
out.

### 3.1 Circular-dependency rule (critical)

`src/router.tsx` imports every feature entry, so a feature must **never** import
navigation back from `src/router.tsx` or `src/App.tsx`. Doing so creates a cycle
(`router` → feature entry → feature context → `router`); the feature's
`createContext()` call then evaluates before the registry finishes initialising,
and every `usePortal()` call throws `usePortal must be used inside
PortalProvider`, blanking the page.

The `navigate` helper therefore lives in its own dependency-free module,
`src/navigation.ts`. The registry re-exports it, so existing pages keep importing
`navigate` from `src/router`, and features import it from `src/navigation`.
### 3.2 Guards

```text
visit /admin*  + not authenticated  → navigate('/login')
visit /login   + authenticated      → navigate('/admin')
Logout                                → clear session, navigate('/login')
```

---

## 4. Authentication Design

Authentication is an **abstraction**, not a hard-coded check, so a real identity
provider can replace it later without touching the UI.

```ts
// services/auth.ts
export interface AuthProvider {
  signIn(credentials: Credentials): Promise<AuthSession>
  signOut(): Promise<void>
  restoreSession(): AuthSession | null
}
```

- The password is read from the `PASSWORD` environment secret; the user id from
  `VITE_ADMIN_USER_ID` (defaults to `admin`). Comparison is length-independent.
- The Google organizer account comes from `VITE_ADMIN_EMAIL`
  (defaults to `runningchores@gmail.com`).
- **No real production password is hard-coded in a component.** If `PASSWORD` is
  absent the portal falls back to `admin123` and says so on the login screen.
- Note: Vite compiles `PASSWORD` into the client bundle, so it raises the bar
  against casual access but is not genuine server-side authentication — see
  `src/admin/README-ENV.md` §2.
- The session (`userId`, `issuedAt`) is stored in `localStorage` under
  `rc.employee-portal.session` so a refresh keeps the admin signed in.

---

## 5. Data Model

```ts
interface Employee {
  id: string
  name: string
  email: string
  whatsappNumber: string
  department?: string
  active: boolean
  createdAt: string
}

interface Meeting {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  title: string
  startTime: string      // ISO 8601
  endTime: string        // ISO 8601
  meetUrl?: string
  googleEventId?: string
  createdAt: string
  status: 'upcoming' | 'completed' | 'cancelled'
}
```

### 5.1 Storage Keys

| Key                                | Contents                     |
| ---------------------------------- | ---------------------------- |
| `rc.employee-portal.employees`     | `Employee[]`                 |
| `rc.employee-portal.meetings`      | `Meeting[]`                  |
| `rc.employee-portal.session`       | `AuthSession`                |

Every read is defensive: malformed JSON falls back to an empty array rather than
crashing the app.

---

## 6. Folder Structure

```text
src/admin/
├── DESIGN.md                        # this document
├── README-ENV.md                    # env + Google Meet setup guide
├── App.tsx                          # feature entry — re-exports app/App
├── app/
│   └── App.tsx                      # provider + route guard + view switch
├── components/
│   ├── Header.tsx                   # brand, Create Meeting, nav, Logout
│   ├── EmployeeTable.tsx            # search, sort, row actions
│   ├── MentorTable.tsx              # Google Sheet roster + Status editor
│   ├── CreateMeetingDialog.tsx      # meeting form
│   ├── MeetingSuccessDialog.tsx     # success + copy + WhatsApp
│   ├── ConfirmDialog.tsx            # generic destructive confirm
│   ├── ErrorBoundary.tsx            # keeps a crash from blanking the portal
│   ├── EmptyState.tsx
│   ├── StatusPill.tsx
│   ├── Toast.tsx                    # toast host + hook
│   └── ui/
│       ├── Button.tsx
│       ├── Field.tsx                # label + input + inline error
│       └── Modal.tsx                # accessible dialog shell
├── context/
│   └── PortalContext.tsx            # auth + view + navigation
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useEmployees.ts
│   └── useMeetings.ts
├── pages/
│   ├── Login.tsx
│   ├── Admin.tsx
│   ├── Meetings.tsx
│   └── Settings.tsx
├── services/
│   ├── auth.ts
│   ├── googleCalendar.ts
│   └── whatsapp.ts
├── types/
│   ├── Employee.ts
│   └── Meeting.ts
├── utils/
│   ├── validation.ts
│   └── dateUtils.ts
└── styles/
    └── portal.css                   # feature-scoped tokens only
```

---

## 7. Google Calendar + Meet Integration

`src/services/googleCalendar.ts` is the only module that knows about Google.

```ts
export type GoogleIntegrationMode = 'live' | 'demo'
export function getGoogleMode(): GoogleIntegrationMode
export function authenticateGoogle(): Promise<GoogleAuthResult>
export function createGoogleMeetMeeting(input: CreateMeetingInput): Promise<CreatedMeeting>
export function resetGoogleAuth(): void
```

### 7.1 Live mode flow

1. `VITE_GOOGLE_CLIENT_ID` is present → mode is `live`.
2. Google Identity Services is loaded on demand from
   `https://accounts.google.com/gsi/client`.
3. `authenticateGoogle()` requests the scope
   `https://www.googleapis.com/auth/calendar.events` and resolves with an
   access token. The token is cached in `sessionStorage` for its lifetime
   (~1 hour) and reused, so the sign-in popup appears at most once per hour —
   in practice once per browser session. It is called during **login**, not
   on the Create Meeting button, so that button opens the dialog directly.
4. `createGoogleMeetMeeting()` calls
   `POST https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`
   on the `runningchores@gmail.com` account with:
   - `summary` = meeting title
   - `description` = meeting description
   - `start` / `end` = `dateTime` + `timeZone`
   - `attendees[]` = selected employee email
   - `conferenceData.createRequest` → generates the Google Meet conference
5. The `hangoutLink` from the response is the Meet URL. A missing `hangoutLink`
   in live mode is treated as a **failure**, never as success.

### 7.2 Demo mode

`VITE_GOOGLE_CLIENT_ID` absent → mode is `demo`.
A clearly labelled badge reading **"Google Integration: Demo Mode"** appears in
the header. Demo mode fabricates a Meet code, but the UI must keep marking the
record as a demo so nobody mistakes it for a real invitation.

### 7.3 Security notes

- No Gmail password, private key, service-account key, or client secret.
- The Google Cloud OAuth client is registered as a **Web application** with
  `http://localhost:5173` and the deployed origin in *Authorised JavaScript
  origins*.
- The OAuth client id is not a secret. The access token is cached in
  `sessionStorage` (never `localStorage`), which is a usability cache — readable
  by page scripts — not a security boundary; consent is the real control.
- No Google API key is used or needed: an API key cannot authorise calendar
  access. See `README-ENV.md` §6 for the zero-popup alternatives and their costs.

---

## 8. WhatsApp Integration

`src/services/whatsapp.ts` is the only module that knows about WhatsApp.

```ts
export function normalizeWhatsAppNumber(raw: string): string
export function buildMeetingMessage(meeting: Meeting): string
export function getWhatsAppShareUrl(phone: string, message: string): string
export function shareOnWhatsApp(phone: string, message: string): void
```

- `normalizeWhatsAppNumber` strips spaces, dashes, brackets and a leading `+`,
  and drops a leading `00`.
- The share URL is `https://wa.me/<digits>?text=<encoded message>`.
- The message template is exactly:

```text
Hi <First Name>,

Your meeting with Running Chores has been scheduled.

Meeting:
<Title>

Date:
<30 September 2026>

Time:
<4:00 PM - 4:30 PM>

Google Meet:
<https://meet.google.com/xxx-xxxx-xxx>

Please join using the above Google Meet link.

Regards,
Running Chores
```

**Explicit limitation surfaced in the UI:** the portal opens WhatsApp with a
pre-filled message; the admin still presses send. A future WhatsApp Business API
implementation replaces the internals of this one file and nothing else.

---

## 9. Validation Rules

`utils/validation.ts` owns all rules so the form and the table agree.

| Field          | Rule                                                             |
| -------------- | ---------------------------------------------------------------- |
| Name           | Required, trimmed length ≥ 2                                     |
| Email          | Required, valid format, unique across employees (case-insensitive)|
| WhatsApp number| Required, 10–15 digits after stripping separators                |
| Department     | Optional                                                        |
| Meeting title  | Required, trimmed length ≥ 3                                     |
| Date           | Required, must be a real calendar date                          |
| Start time     | Required, `HH:mm`                                               |
| Duration       | Required, one of 15/30/45/60/90/120 minutes                    |

Errors render inline beneath the field, the field gets `aria-invalid`, and the
dialog's submit button is disabled until the form is valid.

---

## 10. UI / UX Design

Professional SaaS admin aesthetic. Light, clean, calm.

- **Palette:** slate neutrals, `cyan-600` primary action, emerald for success,
  rose for destructive, amber for warnings. Flat surfaces, 1px borders, subtle
  shadows — no gradients, no glassmorphism.
- **Radius:** 12–16px (`rounded-xl` / `rounded-2xl`).
- **Type:** Inter (already loaded globally). Page titles 24–30px semibold,
  body 14–15px, metadata 12–13px.
- **Header:** sticky, `RUNNING CHORES` wordmark left; right side holds the
  Google-mode badge, **Create Meeting** (primary), and **Logout**.
- **Table:** sticky header row, name + department + email + WhatsApp columns,
  Active status pill, and Edit / Delete row actions. Search input above the
  table. Rows sourced from the Google Sheet show a **From sheet** badge and
  cannot be edited or deleted here — the sheet is the source of truth for them.
- **Empty states:** "No employees yet" with a call to action; "No meetings yet"
  with a call to create one.
- **Toasts:** bottom-right, auto-dismiss 4s, success / error / info variants.
- **Loading:** inline spinner in the Create Meeting submit button while Google
  is authenticating; button disabled to prevent double submission.
- **Accessibility:** every input has a `<label>`, modals trap focus and close on
  `Esc`, `aria-modal` + `role="dialog"` set, visible focus rings, full keyboard
  operability, `aria-live="polite"` on toast host.
- **Responsive:** table collapses to stacked cards below `md`; header wraps.

### 10.1 Dialog Inventory

| Dialog                 | Trigger                  | Actions                                   |
| ---------------------- | ------------------------ | ----------------------------------------- |
| `CreateMeetingDialog`  | Create Meeting (header)  | Cancel, Create Meeting                    |
| `MeetingSuccessDialog` | After successful create  | **Share on WhatsApp** (primary), Copy Meet Link, Close |
| `ConfirmDialog`        | Cancel a meeting         | Cancel, Cancel meeting (destructive)      |

There is no Add/Edit Employee dialog: employees come from the Google Sheet.

### 10.2 Meeting Success Dialog Content

Employee name, email, meeting title, formatted date, formatted time range,
Meet link, a Copy Meet Link button, and Share on WhatsApp as the visually
dominant action. If the employee has no WhatsApp number the WhatsApp button is
disabled with an explanatory line — the Meet link remains copyable (error case
E4 in §12).

---

## 11. Page Specifications

### 11.1 `/login` — Login

Centred card on a light slate background. Wordmark "RUNNING CHORES" over
"Employee Management". Fields: **User ID**, **Password** (with show/hide
toggle). Primary **LOGIN** button. Inline error on failed sign-in. When running
on demo credentials, a small muted hint shows the configured user id. No
employees, no meeting data, nothing else.

### 11.2 `/admin` — Admin (primary screen)

Employees table as described in §10. This is the screen the admin lives in.

### 11.3 `/admin/meetings` — Meetings

Lightweight history from `localStorage`, newest first. Columns: employee,
title, date, time, status pill, Meet link, cancel action. Filter by status.
This is explicitly secondary.

### 11.4 `/admin/settings` — Settings

Read-only-ish internal settings: Google integration mode and organizer account,
demo credentials in use (masked), meeting history count, and a "Reset local
data" destructive action behind a confirm dialog.

---

## 12. Error Handling Matrix

| # | Situation                                   | Behaviour                                                                 |
|---|---------------------------------------------|---------------------------------------------------------------------------|
| E1 | Google auth failure                         | Error toast: "Unable to authenticate with Google. Please sign in again." Dialog stays open. |
| E2 | Calendar API failure                        | Error state inside the dialog: "Unable to create the Google Meet. Please try again." No success dialog, nothing saved. |
| E3 | Employee has no valid email                 | Inline: "This employee does not have a valid email address." Create disabled. |
| E4 | Employee has no WhatsApp number             | Meeting is still created; Share on WhatsApp is disabled with "This employee does not have a WhatsApp number." Copy Meet Link still works. A missing WhatsApp number is deliberately **not** a blocking validation error. |
| E5 | WhatsApp share fails / popup blocked        | Meeting remains valid; error toast: "Could not open WhatsApp. Copy the Meet link instead." |
| E6 | Duplicate employee email                    | Inline field error on save. |
| E7 | Corrupted `localStorage` payload            | Silently reset to empty state; no crash.                                  |
| E8 | Google returns no `hangoutLink` (live)      | Treated as E2. Never a silent success.                                     |

---

## 13. User Journey Acceptance Checklist

- [ ] Unauthenticated visit to `/admin` redirects to `/login`.
- [ ] Login with configured credentials lands on `/admin`.
- [ ] Employee list renders from `localStorage`; survives a page refresh.
- [ ] The **Mentor Database** table syncs from the "Become a Mentor" Google
      Sheet (`Mentors` tab) and lists Timestamp / Name / Phone number /
      "I want to mentor as" / Skill description / Status.
- [ ] Changing Status in the admin UI writes back to the exact sheet cell.
- [ ] There is **no Add Employee button** — the form is the only way in.
- [ ] `Create Meeting` in the header opens the dialog with an employee dropdown
      populated from the portal's employees.
- [ ] Selecting an employee reveals their email automatically.
- [ ] `Create Meeting` authenticates with Google, creates the event with
      organizer `runningchores@gmail.com` and the employee as attendee.
- [ ] A Google Meet URL is returned and shown in the success dialog.
- [ ] `Copy Meet Link` copies to the clipboard with confirmation.
- [ ] `Share on WhatsApp` opens WhatsApp for the employee's stored number with
      the message pre-filled.
- [ ] The meeting is written to `localStorage` history and appears on
      `/admin/meetings`.
- [ ] Logout clears the session and returns to `/login`.
- [ ] Browser back/forward works across all portal routes.

---

## 14. Implementation Order

1. Types, storage keys, `validation.ts`, `dateUtils.ts`.
2. `services/auth.ts`, `services/googleCalendar.ts`, `services/whatsapp.ts`.
3. `hooks/useLocalStorage.ts`, `useEmployees`, `useMeetings`; `PortalContext`.
4. UI primitives (`Button`, `Field`, `Modal`, `Toast`).
5. `Header`, `EmployeeTable`, `MentorTable`, `ConfirmDialog`.
6. `CreateMeetingDialog`, `MeetingSuccessDialog`.
7. `Login`, `Admin`, `Meetings`, `Settings` pages.
8. `App.tsx` entry + `styles/portal.css`.
9. Register the four routes in `src/router.tsx`.
10. `npm.cmd run typecheck` and `npm.cmd run build`.

---

## 15. Environment Variables

```dotenv
# Admin sign-in password, supplied as a deployment secret.
# Exposed to the client via `envPrefix: ['VITE_', 'PASSWORD']` in vite.config.ts.
# It is compiled into the bundle, so it deters casual access but is not a true
# secret. See README-ENV.md §2.
PASSWORD=

# Google OAuth 2.0 **Web application** client id. Public — not a secret.
# Absent → the portal runs in clearly labelled Demo Mode.
VITE_GOOGLE_CLIENT_ID=

# Admin user id for the login form.
VITE_ADMIN_USER_ID=admin

# Google account that organises every meeting (owns the Calendar).
VITE_ADMIN_EMAIL=runningchores@gmail.com
```

A ready-to-copy `.env.example` lives at the repo root. Full Google setup
walkthrough: `src/admin/README-ENV.md`.
