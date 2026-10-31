한 번 보낸 요청이나 메시지를 **다시 보내는** 것입니다. Messages API 는 상태를 기억하지 않아서, 다음 턴마다 이전 대화를 담아 다시 보내는 일이 기본 동작입니다.

## 문제 속 쓰임
> Run the tool, add its output as a tool_result block with the matching tool_use_id in a user message, and **resend** the history with the tool_use turn
> 도구를 실행하고, 그 출력을 짝이 맞는 `tool_use_id` 의 `tool_result` 블록으로 user 메시지에 담은 뒤, `tool_use` 턴을 포함한 이력을 **다시 보낸다**.

## 함께 쓰는 표현
- **resend the history** : 대화 이력을 다시 보내다
- **resend unchanged** : 아무것도 바꾸지 않고 그대로 다시 보내다
- **keep resending** : 계속 다시 보내다

## 비슷한 말 · 반대말
- **retry** — 실패한 요청을 다시 시도하다
- **resubmit** — 다시 제출하다

## 시험 포인트
이 보기가 정답입니다. `tool_result` 는 **user 메시지**에 넣고 `tool_use` 턴을 이력에 남겨 다시 보내야 합니다. 반면 빈 응답을 **그대로** 다시 보내거나, 정책 때문에 영영 성공할 수 없는 요청을 **계속** 다시 보내는 보기는 오답입니다.
