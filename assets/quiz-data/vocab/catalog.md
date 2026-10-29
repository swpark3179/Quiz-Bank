무엇이 있는지 **한눈에 볼 수 있게 정리한 목록**입니다. 데이터베이스에서는 테이블·컬럼 같은 스키마 정보를 모은 목록을 말합니다. (영국식 철자 *catalogue*)

## 문제 속 쓰임
> Expose the schema **catalog** as an MCP resource that the agent reads once upfront, instead of probing with repeated exploratory tool calls.
> 스키마 **카탈로그**를 MCP 리소스로 노출해 에이전트가 처음에 한 번 읽게 하고, 반복적인 탐색용 도구 호출로 더듬어 찾지 않게 한다.

## 함께 쓰는 표현
- **schema catalog** : 스키마 목록
- **product catalog** : 상품 목록

## 시험 포인트
"무엇이 있는지 알아내려는 탐색용 도구 호출이 반복된다"면 카탈로그(스키마·인덱스·파일 목록)를 **MCP 리소스**로 노출하는 것이 정답입니다. 도구는 동작, 리소스는 읽을 데이터입니다.
