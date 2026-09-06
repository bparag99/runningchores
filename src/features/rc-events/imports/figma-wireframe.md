# Figma-Ready Wireframe Structure for RC Events Operations Platform

## 1. Product Summary

RC Events is an operational command center for wedding planners and event-management teams. The experience is designed for repeated daily work: monitor event readiness, resolve tasks, coordinate vendors, review approvals, manage budget, communicate with the team, and respond to alerts.

The RunningChores route is:

```text
/rc-events
```

This feature is isolated under `src/features/rc-events/` and is mounted by the shared RunningChores route registry. It must not create its own Vite app, HTML entrypoint, React root, or deployment target.

---

## 2. Screen List

### A. Authentication

1. Login
2. Authentication loading state
3. Authenticated application shell

### B. Core Operations

4. Operations Dashboard
5. Event Details
6. Task List
7. Task Detail
8. Approval Board
9. Vendor Board
10. Budget
11. Calendar

### C. Communication And Monitoring

12. AI Chat
13. Contacts
14. Alerts
15. Settings

### D. Shared States

16. Loading states
17. Empty states
18. Error states
19. Mobile navigation
20. Desktop sidebar navigation
21. Back navigation for detail screens
22. Dark mode

---

## 3. User Flow Sequence

### Primary Flow: Login To Dashboard

1. User opens `/rc-events`.
2. `AuthProvider` checks the local authentication state.
3. If unauthenticated, render `LoginPage`.
4. User submits the login form.
5. Demo authentication marks the user as authenticated.
6. `EventProvider` loads the active event.
7. `AppDataProvider` exposes tasks, vendors, approvals, budget data, notifications, and organization data.
8. Render the shared `Layout` with the dashboard selected.

### Primary Flow: Review Event Operations

1. User lands on Dashboard.
2. Dashboard presents event readiness, budget, vendors, tasks, and upcoming activity.
3. User selects an event or event summary.
4. Navigate to Event Details.
5. User chooses a workflow area: Tasks, Approvals, Vendors, Budget, Calendar, Chat, Contacts, or Alerts.
6. Layout keeps the active navigation state and page title synchronized.

### Primary Flow: Manage Tasks

1. User opens Tasks from the event workspace.
2. Task list is filtered by the active event.
3. User selects a task.
4. Task Detail shows description, due date, assignee, priority, dependencies, and current status.
5. User selects a new status.
6. User saves the change.
7. `AppDataContext` updates the task status and the UI reflects the new badge.
8. User can return to the task list with back navigation.

### Primary Flow: Review Approvals

1. User opens Approvals.
2. Approval cards show title, description, requestor, approver, due date, and status.
3. User filters or scans pending, approved, and rejected approvals.
4. User opens an approval detail or takes the available action.
5. Status changes are reflected in the board and dashboard metrics.

### Primary Flow: Coordinate Vendors

1. User opens Vendors.
2. Vendor board groups vendors by role or assignment state.
3. User reviews contact details, verification status, rating, event assignment, and task scope.
4. User opens a vendor card to inspect details or contact the vendor.

### Primary Flow: Monitor Budget

1. User opens Budget.
2. Budget page displays allocated, paid, remaining, and overdue values.
3. User reviews budget categories and line items.
4. Status and totals remain scoped to the selected event.

### Primary Flow: Use AI Chat

1. User opens AI Chat.
2. Chat page loads existing messages.
3. User selects a quick action or types a message.
4. AI and user messages render with distinct visual treatment.
5. Quick actions provide operational prompts for event planning work.

### Secondary Flow: Contacts And Alerts

1. User opens Contacts to search by name, role, event part, or category.
2. User can call, email, or open WhatsApp for a contact.
3. User opens Alerts to review notifications, risks, and attention items.
4. Selecting an alert navigates to its associated operational page when supported.

### Secondary Flow: Settings And Theme

1. User opens Settings.
2. User reviews profile and organization preferences.
3. User toggles dark mode when supported.
4. User navigates back to the dashboard or another primary area.

---

## 4. Screen-By-Screen Wireframe Details

## Screen 1: Login

Purpose:
- Establish the authenticated entry state for the event operations workspace.

UI elements:
- Product identity: RC Events.
- Email or user identifier field.
- Password field.
- Submit action.
- Inline validation and loading state.
- Responsive layout for mobile and desktop.

Behavior:
- Unauthenticated users cannot access operational pages.
- Successful login reveals the shared operations layout.
- Failed login remains on the screen with an understandable error state.

---

## Screen 2: Operations Dashboard

Purpose:
- Give the event team a quick operational read of the active event.

Core content:
- Event readiness score.
- Upcoming timeline.
- Task progress.
- Approval status.
- Vendor readiness.
- Budget summary.
- Notification and alert count.
- Quick actions.
- Key contacts.

Layout:
- Desktop: persistent sidebar with dense dashboard content.
- Mobile: compact header and bottom navigation.
- Use cards for repeated operational metrics, not decorative marketing sections.

States:
- Loading dashboard data.
- Empty organization or event state.
- Active event loaded.
- Error loading a data domain.

---

## Screen 3: Event Details

Purpose:
- Show the selected event's overview and operational metrics.

Fields:
- Event name.
- Couple or client names.
- Event date.
- Venue and city.
- Guest count.
- Total budget.
- Event status.
- Readiness score.

Actions:
- Navigate to tasks.
- Navigate to vendors.
- Navigate to approvals.
- Navigate to budget.
- Return to dashboard.

---

## Screen 4: Task List

Purpose:
- Display and filter work assigned to the active event.

Task card fields:
- Task title.
- Description preview.
- Due date.
- Assigned person or vendor.
- Priority.
- Status.
- Event association.

Status values:
- Not Started.
- In Progress.
- Pending Approval.
- Blocked.
- Completed.

Interactions:
- Select a task for detail.
- Filter or scan by status.
- Sort by priority or due date where supported.
- Show empty state when no tasks match.

---

## Screen 5: Task Detail

Purpose:
- Inspect and update one operational task.

Content:
- Full task description.
- Due date.
- Assigned vendor or user.
- Priority indicator.
- Status selector.
- Dependencies.
- Save action.
- Back action.

Validation:
- Status changes must preserve the `TaskStatus` domain values.
- Save feedback should be visible and temporary.
- Missing selected task falls back to the task list instead of a blank screen.

---

## Screen 6: Approval Board

Purpose:
- Manage requests that require review or sign-off.

Approval fields:
- Approval type.
- Title.
- Description.
- Requested by.
- Approver.
- Due date.
- Status.
- Approval comments.
- Approval date.

Visual states:
- Pending: amber.
- Approved: green.
- Rejected: red.

---

## Screen 7: Vendor Board

Purpose:
- Track vendor readiness and assignments for the active event.

Vendor fields:
- Vendor name.
- Category.
- Phone.
- Email.
- City.
- Verification state.
- Rating.
- Assignment status.
- Assignment scope.

Actions:
- Open vendor detail.
- Call vendor.
- Email vendor.
- Open WhatsApp when a phone number is available.

---

## Screen 8: Budget

Purpose:
- Provide a financial view of the active event.

Metrics:
- Allocated.
- Paid.
- Remaining.
- Overdue.

Rows or cards:
- Budget category.
- Description.
- Vendor or owner.
- Amount.
- Payment status.
- Due date.

---

## Screen 9: Calendar

Purpose:
- Visualize event tasks, deadlines, and schedule milestones.

UI elements:
- Calendar period selector.
- Event date markers.
- Task due dates.
- Selected-day detail list.
- Empty day state.

---

## Screen 10: AI Chat

Purpose:
- Provide an operational copilot for planning questions and quick actions.

UI elements:
- Conversation history.
- AI message style.
- User message style.
- Quick action chips.
- Message input.
- Send action.
- Loading response state.

Accessibility:
- Input must have an accessible label.
- Messages should remain readable in light and dark modes.
- Quick action chips must be keyboard reachable.

---

## Screen 11: Contacts

Purpose:
- Search and contact event participants and vendors.

Search:
- Name.
- Role.
- Event part.

Filters:
- Event category.
- Confirmation status.

Contact actions:
- Phone call.
- WhatsApp.
- Email.

States:
- Grouped contacts by event part.
- Empty search results.
- Pending confirmation.
- Confirmed contact.

---

## Screen 12: Alerts

Purpose:
- Collect notifications, risks, and operational attention items.

Alert fields:
- Type.
- Title.
- Description.
- Related event or task.
- Created time.
- Read/unread state.
- Severity.

Severity colors:
- Critical/error: red.
- Warning: amber.
- Informational: blue.
- Resolved/success: green.

---

## Screen 13: Settings

Purpose:
- Provide profile, organization, and display preferences.

Sections:
- User profile.
- Organization.
- Theme mode.
- Notification preferences.
- Application details.

The settings route must remain inside the RC Events feature and must not change the RunningChores shell theme globally.

---

## 5. Data And State Ownership

| Feature module | Responsibility |
| --- | --- |
| `AuthContext` | Authentication state and login boundary |
| `EventContext` | Active event and event selection |
| `AppDataContext` | Tasks, vendors, approvals, budgets, users, notifications, and organization data |
| `data/*.json` | Local fixtures for the wireframe |
| `types/index.ts` | Shared domain contracts |
| `components/` | Layout, navigation, cards, and reusable feature UI |
| `pages/` | Route-level page compositions |

Do not move RC Events data into the global RunningChores shell. Keep it feature-local.

---

## 6. Visual System

Brand colors:

- Primary indigo: `#4F46E5`.
- Secondary purple: `#7C3AED`.
- Accent cyan: `#06B6D4`.

Operational colors:

- Success: `#10B981`.
- Warning: `#F59E0B`.
- Error: `#EF4444`.
- Info: `#3B82F6`.
- Pending: `#6B7280`.

Design principles:

- Operational first.
- Dense but scannable information hierarchy.
- Professional B2B SaaS styling.
- Mobile-responsive layout.
- Accessible status contrast and focus states.
- Dark mode contained within the RC Events feature.
- Lucide icons for interface controls.

---

## 7. Responsive Behavior

Desktop:

- Persistent sidebar.
- Multi-column dashboard cards.
- Tables can use horizontal scrolling when necessary.
- Detail screens use wide content panels.

Mobile:

- Sidebar becomes bottom navigation or compact horizontal navigation.
- Cards collapse to one column.
- Tables become horizontally scrollable or stacked summaries.
- Detail content remains readable without forcing page zoom.
- Header titles and actions must not overlap.

---

## 8. RunningChores Integration Contract

- Feature route: `/rc-events`.
- Feature entry: `src/features/rc-events/app/App.tsx`.
- Root registry: `src/App.tsx`.
- One root `index.html`.
- One root `src/main.tsx`.
- No feature-level `createRoot`.
- No feature-level package manifest or lockfile.
- No second deployment target.

---

## 9. Acceptance Criteria

- Login and authenticated boundary render correctly.
- Dashboard loads from local fixture data.
- Event details, tasks, task detail, approvals, vendors, budget, calendar, chat, contacts, alerts, and settings are reachable.
- Task status changes preserve the typed domain values.
- Contacts expose the expected communication actions.
- Desktop and mobile navigation both remain usable.
- Light and dark theme states do not leak into other RunningChores routes.
- Existing `/`, `/AjantaTyres`, and `/arihant-associates` routes remain unchanged.
- The feature builds through the root RunningChores commands only.
