이미 한 번 알아낸 것을 **처음부터 다시 찾아내는** 것입니다. 에이전트 문제에서는 *불필요하게 반복되는 탐색*을 가리키는 신호어입니다.

## 문제 속 쓰임
> Logs show the subagent re-runs Grep to **rediscover** the entrypoint the coordinator had already located two turns earlier...
> 로그를 보면 서브에이전트가 코디네이터가 두 턴 전에 이미 찾아 둔 진입점을 **다시 찾으려고** `Grep` 을 재실행한다.

## 함께 쓰는 표현
- **rediscover what exists** : 무엇이 있는지 다시 알아내다
- **discover** : (처음) 발견하다

## 시험 포인트
서브에이전트가 이미 알려진 사실을 다시 찾는다면 **위임 프롬프트에 발견 사항을 넣는** 보기가, 매번 스키마를 다시 탐색한다면 **카탈로그를 MCP 리소스로 노출하는** 보기가 정답입니다.
