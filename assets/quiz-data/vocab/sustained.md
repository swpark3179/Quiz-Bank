한 번 반짝하고 끝나지 않고 **일정 기간 끊이지 않고 계속 이어진** 상태를 말합니다. 짧은 급증(*spike*)과 대비되어, 오래 지속된 부하나 행동에 씁니다.

## 문제 속 쓰임
> During review they find a session that Claude ended after **sustained** abusive messages, and the final tool call of that session is missing from the log.
> 검토 중, **지속적인** 악성 메시지 끝에 Claude 가 종료한 세션이 발견되었는데 그 세션의 마지막 도구 호출이 로그에 없습니다.

## 함께 쓰는 표현
- **sustained abuse** : 지속적인 악용·폭언
- **sustained load** : 계속 이어지는 부하
- **sustain** (동) : 유지하다, 지탱하다

## 비슷한 말 · 반대말
- **persistent** — 끈질긴, 계속되는
- **brief** — 짧은, 잠깐의

## 시험 포인트
*sustained abusive messages* 끝에 세션을 끝낸 것은 `EndConversation` 도구입니다. 이 호출은 PreToolUse·PostToolUse 훅을 **모두 건너뛰므로** `"*"` 매처 감사 훅에도 기록되지 않습니다.
