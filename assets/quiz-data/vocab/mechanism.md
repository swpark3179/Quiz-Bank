어떤 일이 **일어나게 하는 수단·장치·작동 원리**입니다. "그걸 할 방법(장치)이 있느냐"를 말할 때 *no mechanism to* ~ 로 자주 씁니다.

## 문제 속 쓰임
> The coordinator's allowedTools list omits 'Task', so it has no **mechanism** to spawn any subagents
> 코디네이터의 `allowedTools` 목록에 `Task` 가 빠져 있어, 서브에이전트를 생성할 **수단이** 아예 없다

## 함께 쓰는 표현
- **retry mechanism** : 재시도 장치
- **enforcement mechanism** : 강제 수단
- **no mechanism to** ~ : ~할 방법이 없다

## 시험 포인트
코디네이터가 **위임을 전혀 시도하지 않는다면** 먼저 도구 구성에 `Task`(Agent) 도구가 있는지 확인합니다. 서브에이전트를 띄울 수단 자체가 없으면 모델 크기나 프롬프트를 바꿔도 소용없습니다.
