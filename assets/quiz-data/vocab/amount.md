1. **금액** — 돈의 액수 (*refund amount*)
2. **양, 분량** — 셀 수 없는 것의 양 (*a large amount of context*)

## 문제 속 쓰임
> The support agent, however, has autonomously called process_refund for **amounts** over $500 in several audited cases.
> 그런데 감사한 사례 중 여러 건에서 지원 에이전트가 $500 초과 **금액**에 대해 스스로 `process_refund` 를 호출했습니다.

## 함께 쓰는 표현
- **refund amount** : 환불 금액
- **amount to** ~ : (합계가) ~에 달하다

## 시험 포인트
"$500 초과 금액은 **반드시** 관리자 승인"처럼 금액 한도를 보장해야 하면 프롬프트가 아니라 **PreToolUse hook** 으로 막고 에스컬레이션하는 것이 정답입니다.
