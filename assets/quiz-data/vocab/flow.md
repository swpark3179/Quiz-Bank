1. **(명) 흐름** — 작업·대화가 진행되는 순서와 경로 (*workflow*, *control flow*)
2. **(동) 흘러가다, 흘러 들어가다** — 데이터·출력이 다음 단계로 그대로 넘어가다

## 문제 속 쓰임
> Add a PreToolUse hook on process_refund that blocks any amount over $500 and redirects the **flow** to escalate_to_human.
> `process_refund` 에 PreToolUse 훅을 추가해 $500 초과 금액을 차단하고 **흐름**을 `escalate_to_human` 으로 돌린다

## 함께 쓰는 표현
- **redirect the flow** : 흐름을 다른 쪽으로 돌리다
- **flow (straight) into** ~ : ~로 (그대로) 흘러 들어가다
- **control flow / data flow** : 제어 흐름 / 데이터 흐름

## 시험 포인트
금액 한도처럼 **반드시 지켜야 하는 정책**은 프롬프트가 아니라 **PreToolUse 훅**으로 호출을 막고 에스컬레이션 흐름으로 돌리는 보기가 정답입니다.
