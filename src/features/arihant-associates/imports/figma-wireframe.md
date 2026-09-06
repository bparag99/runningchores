# Figma-Ready Wireframe Structure for Arihant Associates Valuation Portal

## 1. Product Summary

Arihant Associates is a property valuation workspace for architects, engineers, registered valuers, and chartered engineers. The experience moves from a public practice introduction into a report-selection workflow and then into a structured valuation workspace.

The RunningChores route is:

```text
/arihant-associates
```

The implementation follows the source Flutter flow documented in:

```text
bs-arihant-associates-flutter/README.md
```

The React feature is isolated under `src/features/arihant-associates/` and follows the RC Events organization pattern:

```text
src/features/arihant-associates/
├── app/
├── components/
├── context/
├── data/
├── pages/
├── styles/
└── types/
```

---

## 2. Screen List

### A. Public Entry

1. Arihant Associates Home
2. Practice contact details
3. Start valuation action
4. View dashboard action

### B. Report Setup

5. Select Report Category modal
6. Report type selection
7. Bank selection
8. Get Started validation

### C. Valuation Workspace

9. Dashboard / Home
10. Summary / Immovables
11. Settings
12. Return to portal
13. Responsive mobile navigation

### D. Immovables Data Entry

14. General section
15. Physical Characteristics section
16. Town Planning Parameters section
17. Legal Aspects section
18. Socio Cultural Aspects section
19. Economic Aspects section
20. Functional Utilitarian Aspects section
21. Infrastructure Availability section
22. Marketability section
23. Engineering Technology Aspects section
24. Environmental Factors section
25. Architectural Aesthetic Quality section
26. Industrial Property Valuation section
27. Valuation section

### E. Field States

28. Text input
29. Date input
30. Dropdown input
31. Grouped nested inputs
32. Save draft state
33. Continue section state
34. Mock AI population state
35. Empty/default workflow state

---

## 3. User Flow Sequence

### Primary Flow: Home To Report Workspace

1. User opens `/arihant-associates`.
2. Home screen displays Arihant Associates branding, practice tagline, address, email, and workflow actions.
3. User chooses `Start a valuation`.
4. Report selection modal opens.
5. User selects a report type.
6. User selects a bank.
7. `Get started` becomes available only after both choices are present.
8. The feature derives a report category from the selected bank and report type.
9. The modal closes.
10. The feature opens the valuation dashboard.

### Secondary Flow: Open Dashboard Directly

1. User selects `View dashboard` from the home screen.
2. Dashboard opens with the default report and bank labels when no setup has been completed.
3. User can update the reference number.
4. User selects Summary to open the immovables workflow.

### Primary Flow: Complete Immovables Sections

1. User opens Summary.
2. The left section navigation lists all fourteen sections.
3. User selects a section.
4. The right panel renders the selected section definition.
5. User fills text, date, dropdown, or grouped fields.
6. User saves a draft or continues to the next section.
7. The current values remain in feature context while moving between sections.
8. User can trigger `Fill sample AI data` to populate representative values for sections I-III.

### Secondary Flow: Workspace Navigation

1. User uses the desktop sidebar or mobile horizontal navigation.
2. User can move between Home, Summary, and Settings.
3. User selects `Return to portal` to return to the Arihant public home screen.
4. The RunningChores root route remains outside the feature and is not replaced by feature navigation.

---

## 4. Screen-By-Screen Wireframe Details

## Screen 1: Arihant Associates Home

Purpose:
- Introduce the valuation practice and provide a clear entry into the report workflow.

Header:
- Arihant Associates brand mark.
- `Certified Property Valuation Portal` status label.

Hero content:
- Title: `Arihant Associates`.
- Tagline: `Architects & Engineers, Regd. Valuers, Chartered Engineer`.
- Supporting description for valuation/report preparation.
- Primary action: `Start a valuation`.
- Secondary action: `View dashboard`.

Contact information:
- `107, Apollo Arcade, Old Palasia, Indore`.
- `ksgfibre@yahoo.co.in`.
- Inspection-ready workflow descriptor.

Right-side preview panel:
- Active reports metric.
- Inspections metric.
- Report readiness progress.
- New valuation report prompt.

Responsive behavior:
- Desktop: two-column hero and workspace preview.
- Mobile: stacked hero, actions, contact details, and preview.

---

## Screen 2: Select Report Category

Purpose:
- Establish the report context before entering property details.

Fields:

- Report type.
  - Required select field.
  - Options include residential, commercial, industrial, and land/building valuation.
- Bank name.
  - Required select field.
  - Options include Punjab National Bank, Union Bank of India, State Bank of India, and HDFC Bank.

Actions:

- Close modal.
- Get started.

Validation:

- Get Started remains disabled when either field is empty.
- Selected values are stored in `ArihantContext`.
- `reportCategory` is derived from the selected bank and report type.

---

## Screen 3: Valuation Dashboard

Purpose:
- Provide the report workspace overview and report basics.

Header:

- Arihant Associates identity.
- Search affordance on desktop.
- Account affordance.

Summary cards:

- Reference number.
- Inspection progress.
- Report status.

Invoice table:

- Invoice number.
- Status.
- Payment method.
- Date.
- Amount.

Context:

- Show selected report type and bank.
- Show draft/in-progress status.
- Provide a clear next step into Summary / Immovables.

---

## Screen 4: Summary / Immovables

Purpose:
- Capture the property report through fourteen structured sections.

Navigation:

- Desktop: left section list.
- Mobile: horizontal scrollable section list.
- Active section uses blue text and a pale gray-blue surface.

Content panel:

- Section code.
- Section title.
- Draft status badge.
- Field grid.
- Save draft action.
- Continue section action.
- Sample AI data action.

The selected section is driven by the `reportSections` data definition rather than hard-coded page markup.

---

## Screen 5: Immovables Section Fields

The source JSON supports these field types:

### Text

- Single-line property or report detail.
- Placeholder: `Enter details`.

### Date

- Native date input in the web port.
- Used for inspection and valuation dates.

### Dropdown

- Select field with section-defined options.
- Used for property classification, approvals, verification, and section status.

### Group

- Fieldset containing nested child fields.
- Used for combined classifications such as `High / Middle / Poor` and `Urban / Semi Urban / Rural`.

---

## Screen 6: Settings

Purpose:
- Provide a safe feature-local settings surface for the valuation practice.

Cards:

- Report defaults.
- Account and practice administrator.

Behavior:

- Settings stay inside the Arihant feature.
- Settings must not change the global RunningChores shell theme or route state.

---

## 5. State And Data Ownership

| React module | Responsibility |
| --- | --- |
| `ArihantContext` | View selection, report setup, workflow basics, section values, mock AI population |
| `data/reportData.ts` | Report types, banks, cities, section definitions, mock AI fields |
| `types/index.ts` | Workflow, field, option, and section contracts |
| `pages/HomePage.tsx` | Public practice page and report selection modal |
| `pages/DashboardPage.tsx` | Dashboard metrics, invoices, reference number, and next step |
| `pages/ImmovablesPage.tsx` | Fourteen-section property data-entry flow |
| `pages/SettingsPage.tsx` | Feature-local settings surface |
| `components/Layout.tsx` | Shared Arihant workspace header, sidebar, and mobile navigation |

The context mirrors the Flutter ownership model:

- Flutter `HeaderStore` maps to report/workflow state.
- Flutter `DashboardState` maps to dashboard workflow fields.
- Flutter `ImmovablesStore` maps to section definitions and section values.
- Flutter `JsonStore` is represented by local typed fixtures for the wireframe.

---

## 6. Visual System

Primary palette:

- Warm ivory: `#FFFDF8`.
- Dark blue: `#3B5998`.
- Light blue: `#2D9CDB`.
- Action blue: `#1A0DAB`.
- Workspace gray: `#E9ECEF`.
- Card gray: `#F5F7FA`.
- Text: `#212529`.

Visual language:

- Rounded cards and panels.
- Soft borders rather than heavy outlines.
- Blue action color for primary workflow movement.
- Compact uppercase metadata labels.
- Clear report status badges.
- Responsive section navigation.
- Professional practice/operations tone rather than consumer marketing styling.

---

## 7. Responsive Behavior

Desktop:

- Two-column public home page.
- Persistent workspace sidebar.
- Two-column section editor with left navigation and right content.
- Multi-column dashboard metrics.

Mobile:

- Home content stacks vertically.
- Workspace sidebar becomes horizontal navigation pills.
- Section list becomes horizontally scrollable.
- Field grids collapse to one column.
- Tables remain horizontally scrollable where required.
- Header actions remain reachable without overlap.

---

## 8. Known Flutter Mismatches And Web Decisions

1. Flutter's mobile home currently renders `Mobile Home Screen`; the web port uses the full responsive home flow instead.
2. Flutter has multiple legacy screen trees; the web port follows the active route flow described in the source README.
3. Flutter currently loads the `PNB_FLT` report fixture regardless of the calculated category; the web port displays the chosen category while using representative typed definitions.
4. Flutter uses both GetX and Provider; the web port uses a feature-local React context.
5. Flutter's CWS/login destination is a placeholder; the web port keeps account/settings as a non-authenticated wireframe surface.
6. Flutter's source JSON has many fields; the first web wireframe models the representative field patterns and keeps the section definitions extensible.

---

## 9. RunningChores Integration Contract

- Feature route: `/arihant-associates`.
- Feature entry: `src/features/arihant-associates/App.tsx`.
- Feature implementation: `src/features/arihant-associates/app/App.tsx`.
- Root route registration: `src/App.tsx`.
- One root `index.html`.
- One root `src/main.tsx`.
- No feature-level `createRoot`.
- No nested package manifest or lockfile.
- No second deployment target.

---

## 10. Acceptance Criteria

- Home, report selection, dashboard, Summary, Settings, and return-home flows are reachable.
- Report type and bank are required before starting a valuation.
- Selected report and bank are visible in the workspace.
- All fourteen immovables sections are selectable.
- Section fields support text, date, dropdown, and grouped field patterns.
- Section values persist while navigating between sections.
- Mock AI data populates representative sections I-III.
- Existing `/`, `/AjantaTyres`, and `/rc-events` routes remain unchanged.
- The feature builds through root RunningChores commands only.
