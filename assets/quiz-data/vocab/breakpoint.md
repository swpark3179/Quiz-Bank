1. **(캐시) 중단점** — `cache_control` 을 붙여 "프롬프트 앞부분을 여기까지 캐시하라"고 표시한 지점입니다
2. **(디버거) 중단점** — 코드 실행을 그 줄에서 멈추게 하는 표시입니다

## 문제 속 쓰임
> Add a second and third **breakpoint** on the knowledge base so that the cache entry lasts three times longer.
> 캐시 항목이 세 배 오래 유지되도록 지식 베이스에 두 번째, 세 번째 **중단점**을 추가한다.

> The only `cache_control` **breakpoint** sits on that final block, and `cache_read_input_tokens` is always 0.
> `cache_control` **중단점**은 그 마지막 블록에 하나만 있고, `cache_read_input_tokens`는 항상 0이다.

## 함께 쓰는 표현
- **cache breakpoint** : 캐시 중단점
- **prefix** : 앞부분 (캐시는 앞부분 일치로 동작)

## 시험 포인트
*breakpoint* 수는 캐시할 **위치**를 정할 뿐 유지 시간(TTL)을 늘리지 않습니다. `cache_read_input_tokens` 가 계속 0이면 중단점을 매번 바뀌는 블록에서 **요청 사이에 그대로인 마지막 블록**으로 옮깁니다.
