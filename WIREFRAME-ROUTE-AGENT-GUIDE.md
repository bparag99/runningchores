# RunningChores Wireframe Route Agent Guide

Use this guide when adding a new wireframe project to `runningchores`.

The target architecture is one web application:

- One root `index.html`.
- One root React mount in `src/main.tsx`.
- One Vite development server.
- One production build.
- One preview server.
- One deployment artifact.
- One homepage at `/` that lists every registered wireframe route.
- One isolated feature folder per wireframe under `src/features/`.

Do not create a second Vite app, HTML entrypoint, React root, deployment target, or child-project server inside `runningchores`.

## Required Inputs

Before editing, collect these values:

```text
Feature name:       <human-readable name>
Feature folder:     <lowercase-kebab-case-folder>
Route path:         /<RoutePath>
Feature description: <one-sentence homepage description>
Source project:     <path to the source wireframe>
Feature entrypoint: <component export that renders the wireframe>
```

Example:

```text
Feature name:       Fleet Desk
Feature folder:     fleet-desk
Route path:         /FleetDesk
Feature description: Vehicle scheduling and maintenance operations workspace.
Source project:     D:/wireframes/fleet-desk
Feature entrypoint: FleetDeskApp
```

## Non-Negotiable Rules

- [ ] Work from the `runningchores` repository root.
- [ ] Preserve the existing `/` homepage and its professional RunningChores branding.
- [ ] Add the new route to the existing root route registry.
- [ ] Keep all feature-specific code under `src/features/<feature-folder>/`.
- [ ] Use the existing React/Vite/Tailwind dependency versions unless a required package is missing.
- [ ] Add missing packages to the root `package.json`, never to a nested feature `package.json`.
- [ ] Use the root lockfile and root install command.
- [ ] Do not add a second `createRoot` call.
- [ ] Do not add a second `index.html`.
- [ ] Do not add a second Vite config.
- [ ] Do not add a second `dev`, `build`, or `preview` workflow.
- [ ] Do not import implementation details from another feature folder.
- [ ] Do not replace or redesign existing wireframes unless the request explicitly requires it.

## Phase 1: Inspect The Existing App

- [ ] Read `src/App.tsx` before making changes.
- [ ] Confirm the current `RouteId` type and `Route` type.
- [ ] Confirm the existing `routes` array and its `render` function pattern.
- [ ] Inspect `src/features/ajanta-tyres/` and `src/features/rc-events/` for local conventions.
- [ ] Inspect the source project for its actual production entrypoint, assets, data, styles, and dependencies.
- [ ] Identify duplicate documentation/demo projects and exclude them from production source unless explicitly requested.
- [ ] Search for `createRoot`, `index.html`, `vite.config`, absolute `/src/` imports, and custom asset schemes.
- [ ] Check for global CSS selectors such as `html`, `body`, `#root`, `button`, and `input`.
- [ ] Form one local migration hypothesis and one build/typecheck validation before editing.

## Phase 2: Create The Isolated Feature

Create the feature directory:

```text
src/features/<feature-folder>/
```

Move or copy only production source into it. A typical structure is:

```text
src/features/<feature-folder>/
├── App.tsx                 # Feature-level React entry component
├── components/             # Feature components
├── context/                # Feature providers, if needed
├── data/                   # Mock data or feature fixtures
├── pages/                  # Feature pages or screens
├── styles/                 # Feature stylesheet files, if needed
├── types/                  # Feature types
└── assets/                 # Feature assets
```

Adapt the source entrypoint so it exports a component instead of mounting React:

```tsx
export default function NewFeatureApp() {
  return <FeatureRoot />
}
```

The feature entrypoint must not contain:

```tsx
createRoot(...)
```

It must not depend on a feature-owned `#root` element, standalone HTML file, or child Vite server.

## Phase 3: Resolve Imports And Assets

- [ ] Rewrite imports that point to the old project root.
- [ ] Convert old `@/` aliases to the root `@/` alias or feature-relative imports.
- [ ] Update JSON imports so they resolve from the moved feature folder.
- [ ] Update images, SVGs, CSVs, fonts, and other assets to use imports or `public/` paths supported by the root Vite config.
- [ ] Remove or replace Figma-only asset resolvers when the root build does not provide them.
- [ ] Do not copy a child `node_modules` directory.
- [ ] Do not copy a child lockfile into the feature folder.
- [ ] Do not copy a child `package.json` as a second production manifest.
- [ ] Keep documentation outside the production feature source when it is not executable.

## Phase 4: Handle Styles Safely

- [ ] Keep feature-specific styles under the feature folder where possible.
- [ ] Import feature CSS from the feature entrypoint or root stylesheet according to the existing app pattern.
- [ ] Ensure Tailwind scans the new feature folder.
- [ ] Check that global selectors do not leak into existing routes.
- [ ] Check that existing Ajanta Tyres phone-frame styles are not applied to the new feature.
- [ ] Check that RC Events theme or dark-mode classes are not applied to the new feature accidentally.
- [ ] Keep `@import` statements before CSS rules to avoid Vite/PostCSS warnings.
- [ ] Resolve font imports at the root or before generated CSS rules.

## Phase 5: Register The Route

Update `src/App.tsx`.

### 1. Import The Feature Entry

Add one import near the existing feature imports:

```tsx
import NewFeatureApp from './features/<feature-folder>/App'
```

### 2. Extend The Route ID Union

Add the route ID:

```tsx
type RouteId = 'home' | 'ajanta-tyres' | 'rc-events' | '<feature-id>'
```

Use a lowercase kebab-case ID. Keep the URL path casing exactly as requested by the product owner.

### 3. Add One Route Registry Entry

Add one object to the existing `routes` array:

```tsx
{
  id: '<feature-id>',
  path: '/<RoutePath>',
  title: '<Feature Name>',
  description: '<One-sentence homepage description>',
  render: () => <NewFeatureApp />,
},
```

The homepage automatically lists routes from this array. Do not create a separate homepage link list.

### 4. Confirm Route Matching

The existing route matching should resolve the new path through the registry:

```tsx
const route = routes.find(item => item.path === path)
return route?.id ?? 'not-found'
```

Do not add a second router or a separate route switch unless the existing shell is intentionally replaced.

## Phase 6: Dependency Reconciliation

- [ ] Search imports in the new feature for packages not already present in the root `package.json`.
- [ ] Add missing runtime dependencies to the root `dependencies` object.
- [ ] Add missing build/type packages to the root `devDependencies` object.
- [ ] Prefer versions compatible with the existing React and Vite versions.
- [ ] Avoid installing duplicate React or React DOM versions.
- [ ] Run the root install command from `runningchores`.
- [ ] Review peer dependency warnings instead of ignoring them.
- [ ] Do not use `--force` or `--legacy-peer-deps` as the default fix.
- [ ] Keep the root lockfile updated.

## Phase 7: Focused Validation

Run these commands from `runningchores`:

```powershell
npm.cmd install
npm.cmd run typecheck
npm.cmd run build
```

Then verify the single dev server:

```powershell
npm.cmd run dev
```

Check these URLs from the same server:

```text
/
/<RoutePath>
```

Validation checklist:

- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] `/` returns successfully.
- [ ] The homepage displays the new route card.
- [ ] The new route card opens the new wireframe.
- [ ] Direct navigation to the new route works.
- [ ] Refreshing the new route serves the root SPA entrypoint.
- [ ] Existing `/AjantaTyres` still works.
- [ ] Existing `/rc-events` still works.
- [ ] Browser back and forward work across `/`, existing routes, and the new route.
- [ ] No duplicate React root is created.
- [ ] No console errors or failed asset requests appear.
- [ ] No cross-feature CSS or state leakage appears.
- [ ] Mobile and desktop layouts remain usable.

## Phase 8: Final Review

- [ ] Review the diff for accidental changes outside the new feature and route registry.
- [ ] Confirm no nested `package.json`, lockfile, `index.html`, or Vite config was added for the feature.
- [ ] Confirm no source `node_modules` or generated build output was copied into the feature.
- [ ] Confirm the homepage description is professional and concise.
- [ ] Confirm the route path is documented in the root README if route documentation is maintained there.
- [ ] Update `WIREframe-MERGE-PLAN.md` only if the architecture or acceptance criteria changed.
- [ ] Report the new route, feature folder, commands run, and validation results.

## Agent Completion Report Template

Use this format when the work is complete:

```text
Implemented route: /<RoutePath>
Feature folder: src/features/<feature-folder>/
Feature entrypoint: src/features/<feature-folder>/App.tsx

Changed:
- Added the isolated feature source.
- Registered the route in src/App.tsx.
- Added required root dependencies, if any.
- Updated assets/styles/imports, if any.

Validation:
- npm.cmd run typecheck: PASS/FAIL
- npm.cmd run build: PASS/FAIL
- /: PASS/FAIL
- /<RoutePath>: PASS/FAIL
- Existing routes: PASS/FAIL

Known issues:
- <None or concise list>
```

## Copy-Paste Request For A Future Agent

```text
Add this wireframe to the existing runningchores application as a new isolated route.

Feature name: <name>
Feature folder: <lowercase-kebab-case-folder>
Route path: /<RoutePath>
Description: <homepage description>
Source project: <source path>

Follow WIREFRAME-ROUTE-AGENT-GUIDE.md exactly.
Use the existing root Vite app and route registry. Do not create a second app,
HTML entrypoint, React root, package manifest, lockfile, dev server, or deployment.
Preserve existing routes and homepage branding. Run typecheck and build before finishing.
```
