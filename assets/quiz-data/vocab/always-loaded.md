세션이 시작될 때마다 **자동으로 컨텍스트에 들어가는** 것을 말합니다. CLAUDE.md 가 대표적이며, 필요할 때만 불러오는 *on-demand* 와 대비됩니다.

## 문제 속 쓰임
> The project's **always-loaded** CLAUDE.md has grown to embed a long, detailed code-review rubric.
> 프로젝트의 **항상 로드되는** CLAUDE.md에 길고 상세한 코드 리뷰 루브릭이 들어가 비대해졌습니다.

## 비교
- **always-loaded** — 매번 들어감 (CLAUDE.md) → 모든 작업에 토큰 비용이 붙음
- **on-demand** — 관련 있을 때만 불러옴 (스킬 `.claude/skills/`)

## 시험 포인트
항상 로드되는 CLAUDE.md 가 **특정 작업 전용 내용**으로 비대해졌다면, 그 내용을 **온디맨드 스킬**로 옮겨 필요한 작업에서만 로드되게 하는 것이 정답입니다.
