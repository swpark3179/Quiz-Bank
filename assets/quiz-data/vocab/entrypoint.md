프로그램 실행이나 요청 처리가 **시작되는 지점**입니다. 코드 추적 문제에서는 웹훅 처리 같은 흐름이 **처음 들어오는 함수·파일**을 말합니다. *entry point* 로 띄어 쓰기도 합니다.

## 문제 속 쓰임
> Logs show the subagent re-runs Grep to rediscover the **entrypoint** the coordinator had already located two turns earlier...
> 로그를 보면 서브에이전트가 코디네이터가 두 턴 전에 이미 찾아 둔 **진입점**을 다시 찾으려고 `Grep` 을 재실행한다

## 함께 쓰는 표현
- **main entrypoint** : 주 진입점 (`main` 함수 등)
- **locate the entrypoint** : 진입점을 찾다

## 시험 포인트
서브에이전트가 이미 찾은 것을 **다시 찾고 다른 결론**을 낸다면, 원인은 코디네이터가 확정한 정보를 Task 프롬프트로 **넘겨주지 않은 것**입니다. 서브에이전트는 코디네이터의 대화를 물려받지 않습니다.
