/**
 * History helper shared by the route registry and by feature folders.
 *
 * IMPORTANT: this lives in its own dependency-free module on purpose.
 * `src/router.tsx` imports every feature entry, so a feature that imported
 * `navigate` back from `src/router.tsx` would create a circular dependency —
 * the feature's `createContext` call would then evaluate before the registry
 * finished initialising and every `useX()` in the feature would fail with
 * "must be used inside XProvider". Features must import navigation from here,
 * never from `src/router.tsx` or `src/App.tsx`.
 */
export function navigate(path: string) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
}
