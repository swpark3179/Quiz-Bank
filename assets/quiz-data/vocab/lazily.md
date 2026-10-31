프로그래밍의 *lazy loading* 에서 온 말로, **처음에 전부 불러오지 않고 실제로 필요해지는 순간에** 불러오는 방식입니다. 시작할 때 드는 비용(컨텍스트·메모리)을 아낄 수 있습니다.

## 문제 속 쓰임
> Put the conventions in one src/CLAUDE.md, because nested CLAUDE.md files are the only instruction files that load **lazily**
> 중첩 CLAUDE.md만 **지연 로드되는** 유일한 지침 파일이므로, 규칙을 `src/CLAUDE.md` 하나에 넣는다

## 함께 쓰는 표현
- **load lazily / lazy loading** : 지연 로드
- **on demand** : 요청이 있을 때, 필요할 때

## 비슷한 말 · 반대말
- **eagerly** — 미리, 즉시. 처음에 전부 불러오는 방식 (반대말)
- **at launch** — 시작 시. 루트 CLAUDE.md 와 `@` 로 가져온 파일이 이때 로드됩니다

## 시험 포인트
이 보기는 **전제가 틀려 오답**입니다. 하위 디렉터리 CLAUDE.md 뿐 아니라 `paths` 가 지정된 `.claude/rules/` 규칙도 지연 로드되므로, 여기저기 흩어진 테스트 파일에는 `paths: ["**/*.test.tsx"]` 규칙 하나가 정답이었습니다.
