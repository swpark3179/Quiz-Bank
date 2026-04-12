## 2026-04-12 - Added Screen Reader Roles and Labels to Icon-only Buttons
**Learning:** React Native's `TouchableOpacity` requires explicit `accessibilityRole="button"` and `accessibilityLabel` to correctly announce its purpose and name to screen readers, especially when it only contains generic UI text or icons.
**Action:** Always add `accessibilityRole` and `accessibilityLabel` when building reusable button components or icon-only touchables.
