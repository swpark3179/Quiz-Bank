1. **자원** — 시간·비용·사람·컴퓨팅처럼 일에 쓰는 것
2. **(MCP) 리소스** — MCP 서버가 **읽기용 데이터**(문서, 스키마, 파일 목록 등)를 노출하는 방식. 동작을 수행하는 *tool* 과 구분된다

## 문제 속 쓰임
> Expose the schema catalog as an MCP **resource** that the agent reads once upfront, instead of probing with repeated exploratory tool calls.
> 스키마 카탈로그를 MCP **리소스**로 노출해 에이전트가 처음에 한 번 읽게 하고, 반복적인 탐색용 도구 호출로 더듬어 찾지 않게 한다.

## 함께 쓰는 표현
- **MCP resources / tools / prompts** : MCP 서버가 노출하는 세 가지
- **resource-intensive** : 자원을 많이 쓰는
- **resource limit** : 자원 한도

## 시험 포인트
"무엇이 있는지 알아내려는 탐색 호출이 반복된다"면 콘텐츠 카탈로그를 **MCP 리소스**로 노출하는 보기가 정답입니다. **도구는 동작, 리소스는 읽을 데이터**라고 구분해 두세요.
