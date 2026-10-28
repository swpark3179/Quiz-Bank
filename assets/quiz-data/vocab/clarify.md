1. **(설명을 더해) 분명히 하다** — 지침·문서를 더 명확하게 쓰다
2. **(되물어) 확인하다** — 모호한 점을 상대에게 물어 분명히 하다 (*ask for clarification*)

## 문제 속 쓰임
> Add instructions to the agent's prompt **clarifying** it should only use `fetch_url` for loading document URLs, not searching.
> 에이전트 프롬프트에 `fetch_url` 은 문서 URL 로딩에만 쓰고 검색에는 쓰지 말라고 **분명히 밝히는** 지침을 추가한다.
> ...infer the correct customer without **clarification**.
> **되묻지** 않고 올바른 고객을 추론한다.

## 함께 쓰는 표현
- **ask for clarification** : 명확히 해 달라고 요청하다, 되묻다
- **clarifying question** : 확인 질문

## 시험 포인트
- 프롬프트에 *clarifying* 지침만 더하는 선택지는, 도구가 기술적으로 허용하는 한 무시될 수 있어 오답이 되기 쉽습니다.
- 반대로 동명이인처럼 **추측으로 풀 수 없는 모호함**은 짐작하지 말고 사용자에게 추가 정보를 물어 **확인(clarification)** 하는 쪽이 정답으로 나옵니다.
