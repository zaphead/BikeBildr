# Sharp Stack UI/UX Principles

## 1) Component System and Selection Rules

1. Use `shadcn/ui` as the primary UI component system for all application UI.
2. Before building a UI surface, review available `shadcn/ui` components and blocks first.
3. Prefer existing components over custom components.
4. Build custom components only when `shadcn/ui` cannot cover the use case.
5. Use the right component for the right interaction:
   - Tabs for tabbed content switching.
   - Menus/dropdowns/context menus for contextual actions.
   - Dialogs/sheets/drawers for focused creation or editing flows.
   - Explicit loading components for async operations.

## 2) Immediate Feedback and Perceived Performance

1. A user action must always produce immediate visual feedback.
2. Never leave users in a state where they cannot tell whether an action is processing.
3. Prefer proactive rendering:
   - Render destination structure immediately (page shell, dialog shell, sheet shell).
   - Load data into that structure next.
4. Avoid "wait on old screen, then navigate" when possible.
5. The perceived model should be:
   - "I am already there, and details are still loading."
     instead of
   - "Nothing happened, I am waiting for a page."

## 3) Loading State Design Standards

1. Use loading states for every async boundary.
2. Skeletons must match real layout shape and density.
3. Do not use generic random gray blocks when a real structural skeleton can be shown.
4. Skeleton fidelity should reflect actual content:
   - Field-heavy surfaces show field-like skeletons.
   - Compact modal/sheet flows show compact skeleton patterns.

## 4) Form Placement and Workflow Design

1. Do not place many forms directly on standard pages.
2. On standard pages, avoid always-visible create/edit forms.
3. Trigger forms from explicit actions:
   - Dialog
   - Side sheet
   - Full-screen dialog/sheet
   - Dedicated flow page when truly necessary
4. In general, keep to one active form context at a time.
5. Complex settings pages must avoid becoming "many unrelated forms on one screen."

## 5) Navigation and Interaction Model

1. Short, focused flows should open as dialogs/sheets rather than heavy full-page transitions.
2. Use full-page navigation for major context changes, not every small operation.
3. Prioritize snappy interaction perception:
   - open structure immediately
   - resolve data after
4. Keep workflows composable and low-friction.

## 6) Native vs App-Consistent UI

1. Avoid browser-native alerts/prompts/confirms for product UX.
2. Use app-consistent `shadcn/ui` components for:
   - alerts
   - confirmations
   - menus/dropdowns
   - selectors
   - interaction feedback
3. Native controls are acceptable only when intentionally chosen and justified.

## 7) Layout and Space Utilization

1. Use available interface space intentionally; avoid unnecessary empty space.
2. Global, always-present layout areas should host global functions.
3. Example rule:
   - If a global header exists, place global search in that header instead of consuming page content space.
4. Reduce duplicated UI chrome across pages when shared layout regions can carry it.

## 8) Desktop + Mobile Quality Bar

1. Every shipped interface must work well on desktop and mobile.
2. Interactions must be touch-safe on mobile and efficient on desktop.
3. No desktop-only assumptions in core workflows.

## 9) UX Consistency Requirements

1. Consistent feedback patterns across modules.
2. Consistent loading patterns across modules.
3. Consistent create/edit interaction patterns across modules.
4. Consistent action hierarchy (primary/secondary/destructive) across modules.

## 10) Status Messaging and Layout Stability

1. Do not render transient status updates inline in page layout.
2. Success, warning, and error outcomes for user actions should use toasts by default.
3. Avoid inline messages that appear/disappear and shift layout.
4. Exception for very frequent updates:
   - If an operation happens repeatedly (for example, autosave), use a persistent status slot (badge/text) that is always present.
   - The status slot may change value (`Saving` / `Saved`), but it must not change layout structure.
5. Inline status UI is acceptable only when it is structurally stable and non-shifting.

## 11) Implementation Guidance for Agents

When implementing or refactoring UI:

1. Check `shadcn/ui` component and block options first.
2. Design optimistic interaction structure first (instant shell), then data loading.
3. Add loading, empty, success, and error states explicitly.
4. Prefer action-launched form surfaces (dialogs/sheets) over always-on forms.
5. Use toast-first feedback for non-frequent action outcomes.
6. Validate the final UX on desktop and mobile breakpoints.
7. Ensure changes follow this document before merging.

## 12) Type and Text

1. Do not add text that describes what's going on. Show, don't tell. Do not write any body or header text unless asked for it.
2. Text should NEVER explain UI; that's the point of the user interface: visuals, not text.
3. Use professional type/typography principles in layout. Layouts and type should account for other components outside of the immediate component.
