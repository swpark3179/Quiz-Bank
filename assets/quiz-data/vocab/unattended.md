**곁에서 지켜보거나 응답해 줄 사람이 없는 상태**로 돌아가는 것을 말합니다. 밤새 도는 배치 작업, CI, 무인 지원 에이전트처럼 사람이 승인 프롬프트에 답할 수 없는 환경을 떠올리면 됩니다.

## 문제 속 쓰임
> An **unattended** support agent, where no permission prompt may ever appear, has a PreToolUse hook that denies refunds over $500...
> 권한 프롬프트가 절대 나타나서는 안 되는 **무인** 지원 에이전트에, 500달러를 넘는 환불을 거부하는 PreToolUse 훅이 있습니다...

## 함께 쓰는 표현
- **run unattended** : 사람 없이 돌다
- **unattended job / agent** : 무인 작업·에이전트
- **leave** ~ **unattended** : ~을 지켜보지 않은 채 두다

## 비슷한 말 · 반대말
- **non-interactive** — 대화형 입력 없이 실행되는
- **interactive** — 사람이 지켜보며 응답하는

## 시험 포인트
*unattended* 는 **"ask"(권한 프롬프트)를 쓸 수 없다**는 신호입니다. 정답은 `deny` 로 한도를 지키면서 `permissionDecisionReason` 에 다음 절차(`escalate_refund` 호출 등)를 적어, Claude 가 같은 호출을 재시도하는 대신 방향을 바꾸게 하는 것입니다.
