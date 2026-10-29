1. **촘촘한, 빈틈없는** — *tight loop* 는 쉬는 간격 없이 **연달아 빠르게 도는 루프**
2. **(tighten) 조이다, 다듬다** — 글을 군더더기 없이 짧고 단단하게 손본다

## 문제 속 쓰임
> Retry get_customer automatically in a **tight** loop until the database answers, with no upper bound on attempts or backoff delay.
> 데이터베이스가 응답할 때까지 시도 횟수 상한이나 백오프 지연 없이 `get_customer` 를 **촘촘한** 루프로 자동 재시도한다
> ...add a second formatting pass that reorganizes and **tightens** each report section
> 보고서의 각 섹션을 재구성하고 **다듬는** 두 번째 서식 지정 단계를 추가한다

## 함께 쓰는 표현
- **tight loop** : 대기 없이 계속 도는 루프
- **tight coupling** : 강한 결합 — 구성 요소끼리 단단히 얽힌 상태
- **tighten** (동) 조이다, 더 엄격하게 하다

## 시험 포인트
상한·백오프 없이 tight loop 로 재시도하는 보기는 오답입니다. 일시 장애는 **구조화된 오류**(`isError`, 재시도 가능 여부)로 알려 에이전트가 판단하게 합니다.
