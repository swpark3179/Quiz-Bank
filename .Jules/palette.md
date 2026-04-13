## 2026-04-12 - Added Screen Reader Roles and Labels to Icon-only Buttons
**Learning:** React Native's `TouchableOpacity` requires explicit `accessibilityRole="button"` and `accessibilityLabel` to correctly announce its purpose and name to screen readers, especially when it only contains generic UI text or icons.
**Action:** Always add `accessibilityRole` and `accessibilityLabel` when building reusable button components or icon-only touchables.

## 2024-05-18 - Added Screen Reader Attributes to Interactive Components
**Learning:** In React Native, components that act as interactive elements like cards (`TouchableOpacity`) or present state/progress (`ProgressBar`) need explicit accessibility attributes (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityValue`) to be correctly announced and understood by screen readers, beyond what the visual layout implies.
**Action:** Always verify that interactive custom components have explicit `accessibilityRole` and state attributes matching their semantic purpose (e.g., "button", "progressbar") and provide descriptive `accessibilityLabel` texts, especially when combining text and icons.
