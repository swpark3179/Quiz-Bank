*RPC* 는 **Remote Procedure Call**(원격 함수 호출)입니다. JSON-RPC 는 `method` 와 `params` 를 담은 JSON 메시지로 요청하고 `result` 또는 `error` 로 답하는 규약이며, **MCP 클라이언트와 서버가 이 형식으로 메시지를 주고받습니다**.

## 문제 속 쓰임
> The MCP server turns the generic message into a **JSON-RPC** protocol error, so the model never sees that the call failed.
> MCP 서버가 일반 메시지를 **JSON-RPC** 프로토콜 오류로 바꾸므로, 모델은 호출이 실패했다는 것조차 보지 못한다

## 함께 쓰는 표현
- **JSON-RPC method** : 요청에 적는 메서드 이름 (예: `tools/call`)
- **protocol error** : 프로토콜 수준의 오류. 도구 결과의 `isError` 와는 다릅니다

## 시험 포인트
핸들러가 `isError: true` 를 돌려주면 프로토콜 오류로 바뀌지 않고 **정상 결과로 모델에 전달**되므로 위 보기는 오답입니다. 도구 실행 메서드는 `tools/call`(발견은 `tools/list`)이고, `tools/run`·`tools/invoke` 는 없는 이름입니다.
