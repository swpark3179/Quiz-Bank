하던 일을 끝까지 가지 않고 **도중에 끊어 버리는** 것입니다. 프로그램에서는 루프·요청·작업을 정상 종료 전에 강제로 멈출 때 쓰며, 다시 이어 가기보다 "실패로 끝낸다"는 느낌이 강합니다.

## 문제 속 쓰임
> **Abort** the agent loop and surface the raw HTTP 503 to the end user, since Claude has no way to use a failed call.
> Claude는 실패한 호출을 활용할 방법이 없으므로 에이전트 루프를 **중단하고** 원시 HTTP 503을 최종 사용자에게 보여 준다.

## 함께 쓰는 표현
- **abort the loop** : 루프를 중단하다
- **abort a request** : 요청을 도중에 취소하다

## 비슷한 말 · 반대말
- **cancel** — 취소하다 (시작 전·도중 모두 쓰는 일반적인 말)
- **continue / resume** — 계속하다 / 재개하다

## 시험 포인트
도구 실패 문항에서 *abort the loop* 가 들어간 보기는 오답입니다. 정답은 루프를 끊지 않고 같은 `tool_use_id` 에 `is_error: true` 와 구체적인 오류 메시지를 담은 `tool_result` 를 돌려줘 Claude가 회복하게 하는 것입니다.
