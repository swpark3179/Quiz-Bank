명령·코드·작업을 **실행하다** 라는 뜻입니다. 계획만 세운 것이 아니라 **실제로 수행된** 것을 말할 때 씁니다.

## 문제 속 쓰임
> ...the loop terminates while a tool_use block is still pending, so the refund is never actually **executed**.
> `tool_use` 블록이 아직 처리되지 않은 상태로 루프가 종료되어, 환불이 실제로는 **실행되지** 않는다.

## 함께 쓰는 표현
- **execute a tool call** : 도구 호출을 실행하다
- **execution** (명) 실행 · **executable** (형·명) 실행 가능한 (파일)

## 시험 포인트
`stop_reason` 이 `"tool_use"` 인데 루프를 끝내면 요청된 도구가 **실행되지 않은 채** 남습니다. 도구를 실행하고 그 결과를 돌려준 뒤 루프를 계속해야 합니다.
