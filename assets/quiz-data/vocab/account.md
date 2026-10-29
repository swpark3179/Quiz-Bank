1. **계정** — 고객·사용자 단위로 관리되는 기록 (*customer account*)
2. **설명, 고려** — *account for* 는 "~을 설명하다, ~을 감안하다", *take ~ into account* 는 "~을 고려하다"

## 문제 속 쓰임
> The coordinator has already run get_customer and confirmed the **account**, then spawns subagents to check order history and refund eligibility in parallel.
> 코디네이터가 이미 `get_customer` 를 실행해 **계정**을 확인한 뒤, 주문 이력과 환불 자격을 병렬로 확인하는 서브에이전트들을 생성합니다.

## 함께 쓰는 표현
- **account details / account ID** : 계정 정보 / 계정 식별자
- **take ~ into account** : ~을 고려하다
- **account for** ~ : ~을 설명하다, (비율을) 차지하다 (*accounts for 70%*)

## 시험 포인트
서브에이전트는 코디네이터의 대화를 **상속하지 않습니다**. 이미 확인한 계정·식별자는 각 서브에이전트의 Task 프롬프트에 **명시적으로** 넣어 줘야 모순된 결과가 나오지 않습니다.
