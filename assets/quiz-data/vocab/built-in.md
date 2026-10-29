따로 설치하지 않아도 **처음부터 들어 있는(기본 제공)** 것입니다. Claude Code 에서는 `Read`, `Grep`, `Bash` 처럼 기본으로 있는 도구를 가리킵니다.

## 문제 속 쓰임
> In practice the agent almost always reaches for the **built-in** Grep tool instead, so it misses semantically related call sites that don't share literal text.
> 그런데 실제로 에이전트는 거의 항상 **내장** `Grep` 도구를 쓰기 때문에, 같은 문자열을 공유하지 않는 의미상 관련된 호출 지점을 놓칩니다.

## 함께 쓰는 표현
- **built-in tools** : 내장 도구
- **built-in support** : 기본 지원

## 시험 포인트
에이전트가 MCP 도구 대신 **내장 도구**만 쓴다면, 먼저 MCP 도구 설명을 보강합니다(무엇을 하는지, 언제 내장 도구보다 나은지, 예시 쿼리). 도구 제거나 강제 `tool_choice` 는 첫 단계가 아닙니다.
