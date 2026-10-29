글자 모양이 아니라 **뜻(의미)을 기준으로** 한다는 말입니다. *semantically identical* 은 "표현은 달라도 뜻이 같은"입니다.

## 문제 속 쓰임
> ...a code-intelligence MCP server that does **semantic**, cross-file symbol search over an indexed monorepo.
> 인덱싱된 모노레포에서 **의미 기반의** 파일 간 심볼 검색을 하는 코드 인텔리전스 MCP 서버

## 함께 쓰는 표현
- **semantic search** : 의미 기반 검색 (↔ literal / keyword match 문자열 일치)
- **semantic error** : 의미 오류 — 형식은 맞지만 내용이 틀린 것
- **semantically identical** : 의미상 동일한

## 시험 포인트
에이전트가 의미 검색 MCP 도구 대신 내장 `Grep` 만 쓴다면, 첫 단계는 **도구 설명에 예시 쿼리와 "문자열 매칭이 놓치는 의미 검색"이라는 차이를 적는 것**입니다. 또 스키마는 구문 오류만 막고 **의미 오류는 못 막는다**는 점도 자주 나옵니다.
