## 2024-06-12 - [Batch load category statistics to fix N+1 query]
**Learning:** Found an N+1 query bottleneck when loading the home screen. A loop iterated through categories and queried the database individually (`fetchCategorySummary` function) resulting in multiple queries that should've been handled as one single aggregated query.
**Action:** Created `fetchAllCategorySummaries` using a single `GROUP BY` query to efficiently gather the stat summary for all categories in a single O(1) query.
