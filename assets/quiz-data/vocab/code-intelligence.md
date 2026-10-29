코드를 단순 문자열이 아니라 **심볼·정의·참조 관계로 이해해** 찾고 분석하게 해 주는 기능입니다(정의로 이동, 참조 찾기 등).

## 문제 속 쓰임
> The team added a **code-intelligence** MCP server that does semantic, cross-file symbol search over an indexed monorepo.
> 팀이 인덱싱된 모노레포에서 의미 기반의 파일 간 심볼 검색을 하는 **코드 인텔리전스** MCP 서버를 추가했습니다.

## 비교
- **code intelligence / semantic search** — 의미·구조로 찾음
- **Grep** — 글자가 똑같은 곳만 찾음 (literal matching)

## 시험 포인트
좋은 MCP 도구가 있어도 설명이 빈약하면 에이전트는 익숙한 내장 `Grep` 만 씁니다. 첫 단계는 **도구 설명 보강**(무엇을 하는지, 언제 내장 도구보다 나은지, 예시 쿼리)입니다.
