여러 에이전트·도구·단계를 **누가, 어떤 순서로, 무엇을 할지 조율해 전체 흐름을 짜는 것**입니다. 멀티 에이전트 문제에서는 코디네이터(오케스트레이터)가 하위 작업을 나누고 배분하는 방식을 말합니다.

## 문제 속 쓰임
> What **orchestration** change best fits this workload?
> 이 작업에 가장 잘 맞는 **오케스트레이션** 변경은 무엇일까요?

## 함께 쓰는 표현
- **orchestrator** (명) 조율을 맡는 에이전트 (≈ coordinator)
- **orchestrator-workers** : 오케스트레이터가 입력을 보고 하위 작업을 정해 워커에게 맡기는 패턴
- **orchestrate** (동) 조율하다, 지휘하다

## 비교
- **prompt chaining** — 단계가 미리 고정된 체인
- **orchestrator-workers** — 하위 작업을 실행 중에 동적으로 정함

## 시험 포인트
하위 작업을 미리 알 수 있으면 고정 체인, 조사 도중 새 하위 주제가 드러나는 개방형 작업이면 **동적 분해(orchestrator-workers)** 가 정답입니다.
