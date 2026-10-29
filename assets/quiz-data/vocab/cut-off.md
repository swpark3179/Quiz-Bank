1. **cut off** (동사구) **(도중에) 잘리다, 끊기다** — 응답·연결이 한도나 시간 초과로 중간에 끊길 때
2. **cut-off / cutoff** (명) **기준점, 마감 시점** — *knowledge cutoff*(학습 데이터 기준 시점)

## 문제 속 쓰임
> `max_tokens` — the response was **cut off** at the token limit
> `max_tokens` — 응답이 토큰 한도에서 **잘렸다**
> ...so slow database responses are no longer **cut off** in the middle of a request.
> 느린 데이터베이스 응답이 요청 도중에 **끊기지** 않게 한다

## 함께 쓰는 표현
- **get cut off** : 잘리다, 끊기다
- **cut-off date / point** : 마감일·기준점

## 시험 포인트
`stop_reason` 이 **`max_tokens`** 이면 응답이 한도에서 잘린 것이므로, 그대로 재시도하거나 끝내지 말고 **`max_tokens` 를 늘리거나 이어서 생성**합니다.
