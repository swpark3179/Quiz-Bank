1. **(요청이 서버·자원에) 닿다, 보내지다** — *hit the API* API 를 호출하다
2. **(한도·문제에) 부딪히다, 걸리다** — *hit the rate limit* 속도 제한에 걸리다
3. **(명) (캐시) 적중** — *cache hit* 캐시에 있어 바로 꺼내 씀 (↔ *cache miss*)

## 문제 속 쓰임
> Analysis shows 70% of requests are semantically identical queries from different users **hitting** the same 10 core documents.
> 분석해 보니 요청의 70%가 서로 다른 사용자들이 **같은 핵심 문서 10개에 대해 보내는**, 의미상 동일한 질의였다.

## 함께 쓰는 표현
- **hit a limit** : 한도에 걸리다
- **cache hit rate** : 캐시 적중률

## 시험 포인트
같은 문서에 요청이 **반복해서 몰린다면**, 정적인 시스템 프롬프트와 핵심 문서에 **프롬프트 캐싱**을 걸고 단순한 질의는 Haiku 로 보내는 보기가 정답입니다.
