## 2026-04-12 - Added Screen Reader Roles and Labels to Icon-only Buttons
**Learning:** React Native's `TouchableOpacity` requires explicit `accessibilityRole="button"` and `accessibilityLabel` to correctly announce its purpose and name to screen readers, especially when it only contains generic UI text or icons.
**Action:** Always add `accessibilityRole` and `accessibilityLabel` when building reusable button components or icon-only touchables.

## 2024-05-18 - Added Screen Reader Attributes to Interactive Components
**Learning:** In React Native, components that act as interactive elements like cards (`TouchableOpacity`) or present state/progress (`ProgressBar`) need explicit accessibility attributes (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityValue`) to be correctly announced and understood by screen readers, beyond what the visual layout implies.
**Action:** Always verify that interactive custom components have explicit `accessibilityRole` and state attributes matching their semantic purpose (e.g., "button", "progressbar") and provide descriptive `accessibilityLabel` texts, especially when combining text and icons.

## 2026-04-14 - Accessible Custom Selection Components
**Learning:** When creating custom checkbox or radio button groups in React Native using `TouchableOpacity`, screen readers don't inherently know their semantics or state.
**Action:** Always provide explicit `accessibilityRole="checkbox"` or `"radio"` along with `accessibilityState={{ checked: boolean }}` and a descriptive `accessibilityLabel` to ensure equivalent experience for assistive technologies.

## 2024-05-18 - Consolidated Screen Reader Labels for Complex Cards
**Learning:** When adding accessibility to complex interactive components (like cards with multiple text/icon children) in React Native, providing individual accessibility roles or leaving them default can result in disjointed or missing announcements for screen reader users.
**Action:** Use a single, consolidated `accessibilityLabel` on the parent container (e.g., `TouchableOpacity`) using template literals to combine relevant text context (like titles, descriptions, and dynamic stats) smoothly into one announcement.
