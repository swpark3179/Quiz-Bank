기존 목록·메시지의 **맨 끝에 덧붙이는** 것입니다. 코드에서는 리스트에 항목을 추가할 때 흔히 씁니다(`messages.append(...)`).

## 문제 속 쓰임
> Terminate only on stop_reason end_turn; on tool_use, run the requested tool, **append** its tool_result to the messages, and loop again.
> `stop_reason` 이 `end_turn` 일 때만 종료하고, `tool_use` 이면 요청된 도구를 실행해 그 `tool_result` 를 메시지에 **추가한** 뒤 다시 루프를 돈다

## 함께 쓰는 표현
- **append A to B** : A를 B 끝에 추가하다
- **append-only log** : 덧붙이기만 하고 고치지 않는 로그

## 비교
- **append** — 끝에 덧붙임 · **prepend** — 앞에 붙임 · **insert** — 중간에 끼워 넣음

## 시험 포인트
정답 루프는 `stop_reason` 이 `tool_use` 면 도구를 실행하고 `tool_result` 를 **메시지에 추가해** 다시 호출하고, `end_turn` 일 때만 종료합니다.
