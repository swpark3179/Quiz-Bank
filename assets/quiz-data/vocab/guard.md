1. **(명) 방지 장치, 안전장치** — 루프가 끝없이 돌거나 잘못된 값이 들어오는 것을 **막아 주는 조건 검사**
2. **(동) 지키다, 막다** — *guard against* ~에 대비해 막다

## 문제 속 쓰임
> The loop has no maximum iteration **guard**; a tool returning ambiguous results can cause the model to keep requesting the same tool indefinitely
> 루프에 최대 반복 횟수 **가드**가 없다. 도구가 모호한 결과를 반환하면 모델이 같은 도구를 끝없이 재요청할 수 있다

## 함께 쓰는 표현
- **iteration guard / cap** : 최대 반복 횟수 제한
- **guard against** ~ : ~을 막다, ~에 대비하다
- **guardrail** : 가드레일 — 벗어나지 않게 막는 안전 규칙

## 시험 포인트
에이전트 루프가 **무한 반복**하며 토큰을 태운다면 **최대 반복 횟수 가드**가 없는 것이 원인입니다. 다만 정상 종료 여부 판단은 문구가 아니라 `stop_reason` 으로 합니다.
