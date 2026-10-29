1. **색인, 인덱스** — 빨리 찾을 수 있도록 미리 정리해 둔 목록·자료 구조
2. **인덱싱하다** — 검색하기 좋게 내용을 미리 분석·정리해 두다 (*indexed* 인덱싱된)

## 문제 속 쓰임
> The team added a code-intelligence MCP server that does semantic, cross-file symbol search over an **indexed** monorepo.
> 팀이 **인덱싱된** 모노레포에서 의미 기반의 파일 간 심볼 검색을 하는 코드 인텔리전스 MCP 서버를 추가했다.

## 함께 쓰는 표현
- **code index / search index** : 코드 인덱스 / 검색 인덱스
- **re-index** : 인덱스를 다시 만들다
- 복수형은 **indexes** 또는 **indices**

## 시험 포인트
인덱스 기반 MCP 도구가 있는데도 에이전트가 `Grep` 만 쓴다면 원인은 빈약한 **도구 설명**입니다. 예시 쿼리와 "문자열 매칭이 놓치는 의미 검색"이라는 경계를 설명에 넣는 것이 정답입니다.
