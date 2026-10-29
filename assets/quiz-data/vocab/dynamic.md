미리 정해 두지 않고 **실행하면서 상황에 맞춰 정하는** 것입니다. 처음부터 고정해 두는 *static*·*fixed* 의 반대입니다.

## 문제 속 쓰임
> Use **dynamic** decomposition: the coordinator spawns follow-up subtasks as earlier findings reveal them
> **동적** 분해를 쓴다. 앞선 발견이 새로운 하위 작업을 드러내면 코디네이터가 그에 맞는 후속 하위 작업을 생성한다
> ...then **dynamically** spawn one subagent per discovered component
> 발견된 구성 요소마다 서브에이전트를 하나씩 **동적으로** 생성한다

## 함께 쓰는 표현
- **dynamic decomposition** : 진행 상황에 따라 작업을 나누는 방식
- **dynamically** (부) 동적으로, 그때그때

## 반대말
- **static / fixed / hardcoded** — 미리 고정해 둔

## 시험 포인트
범위를 미리 알 수 없는 **개방형 조사**나 구조를 모르는 코드베이스에는 고정 파이프라인보다 **동적 분해**가 맞습니다. 반대로 단계가 정해진 반복 작업에는 고정된 순서(프롬프트 체이닝)가 맞습니다.
