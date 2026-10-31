두 시스템이 주고받을 때 **지켜야 하는 형식과 순서를 정한 약속**입니다. MCP(*Model Context Protocol*)는 JSON-RPC 라는 프로토콜 위에서 메시지를 주고받습니다.

## 문제 속 쓰임
> The MCP server turns the generic message into a JSON-RPC **protocol** error, so the model never sees that the call failed.
> MCP 서버가 일반 메시지를 JSON-RPC **프로토콜** 오류로 바꾸므로 모델은 호출이 실패했다는 것조차 보지 못한다.

## 함께 쓰는 표현
- **protocol error** : 프로토콜 오류 (메시지 형식·통신 자체의 오류)
- **JSON-RPC protocol** : JSON-RPC 통신 규약
- **Model Context Protocol (MCP)** : 모델과 도구를 잇는 표준 규약

## 비슷한 말 · 반대말
- **specification (spec)** — 명세. 프로토콜을 글로 정한 문서입니다

## 시험 포인트
이 보기는 오답입니다. 핸들러가 `isError: true` 결과를 돌려주면 **정상 결과로 전달되어 모델이 그 텍스트를 읽습니다.** 프로토콜 오류로 바뀌지 않으며, 문제는 오류 내용이 "Operation failed"처럼 비어 있다는 점입니다.
