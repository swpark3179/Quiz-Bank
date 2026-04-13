## 2024-06-12 - [Batch load category statistics to fix N+1 query]
**Learning:** Found an N+1 query bottleneck when loading the home screen. A loop iterated through categories and queried the database individually (`fetchCategorySummary` function) resulting in multiple queries that should've been handled as one single aggregated query.
**Action:** Created `fetchAllCategorySummaries` using a single `GROUP BY` query to efficiently gather the stat summary for all categories in a single O(1) query.

## 2024-08-01 - [Memoize Markdown parsing and rendering]
**Learning:** The quiz app heavily relies on parsing and rendering markdown strings into an AST using regex via `react-native-marked`. Found that `QuizScreen` causes unnecessary re-renders of the `MarkdownViewer` on every user choice interaction, which drops frames. Additionally, returning to a quiz or retrying incorrect questions causes the expensive markdown parser to re-run on strings it has already evaluated.
**Action:** Wrapped `MarkdownViewer` in `React.memo` to skip rendering unchanged content, and introduced a simple in-memory `Map` cache inside `parseQuizMarkdown` to bypass the string processing loop for previously processed strings.
## 2024-08-01 - [Avoid custom JS string hashing for memory caches]
**Learning:** Implemented a custom DJB2 hashing algorithm in JavaScript to create cache keys for parsed Markdown. However, modern V8 JS engines handle native Map string keys in highly optimized C++ code. Iterating over large strings in JS to generate a custom hash is slower and risks cache collisions, breaking correctness.
**Action:** Replaced the custom hashing logic with the raw original string as the `Map` key, leveraging JS string interning for robust and fast cache lookups. Added a simple MAX_CACHE_SIZE eviction strategy to prevent long-term memory leaks.
