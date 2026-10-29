도구·질문으로 **이것저것 찔러 보며 알아내는** 것입니다. 문제에서는 무엇이 있는지 몰라 **탐색용 호출을 반복하는** 비효율을 가리킵니다.

## 문제 속 쓰임
> Expose the schema catalog as an MCP resource that the agent reads once upfront, instead of **probing** with repeated exploratory tool calls.
> 스키마 카탈로그를 MCP 리소스로 노출해 에이전트가 처음에 한 번 읽게 하고, 반복적인 탐색용 도구 호출로 **더듬어 찾지** 않게 한다.

## 함께 쓰는 표현
- **probe for** ~ : ~을 찾으려고 살피다
- **health probe** : (서비스) 상태 확인 요청

## 시험 포인트
"무엇이 있는지 알아내려는 탐색용 호출이 반복된다"면 카탈로그(스키마·인덱스·파일 목록)를 **MCP 리소스**로 노출하는 보기가 정답입니다. 도구는 동작, 리소스는 읽을 데이터입니다.
