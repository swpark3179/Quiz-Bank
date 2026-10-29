안에 있던 기능·데이터를 **밖에서 쓸 수 있게 열어 두다, 노출하다** 라는 뜻입니다. API·MCP 서버가 어떤 도구·리소스를 **제공한다**고 할 때 씁니다.

## 문제 속 쓰임
> **Expose** the schema catalog as an MCP resource that the agent reads once upfront, instead of probing with repeated exploratory tool calls.
> 스키마 카탈로그를 MCP 리소스로 **노출해** 에이전트가 처음에 한 번 읽게 하고, 반복적인 탐색용 도구 호출로 더듬어 찾지 않게 한다

## 함께 쓰는 표현
- **expose A as B** : A를 B 형태로 제공하다
- **expose an endpoint / tool** : 엔드포인트·도구를 공개하다
- **exposure** (명) 노출 — *data exposure* 데이터 유출 위험

## 시험 포인트
에이전트가 목록·카탈로그 같은 **읽기용 정보**를 찾으려고 도구를 여러 번 호출한다면, 그 정보를 **MCP 리소스로 노출해** 미리 읽게 하는 것이 정답 쪽입니다. 도구는 동작을, 리소스는 읽을 거리를 제공합니다.
