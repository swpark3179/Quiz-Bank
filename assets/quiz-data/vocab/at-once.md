1. **동시에, 한꺼번에** — 여러 일이 같은 시점에 (*run two searches at once*)
2. **즉시, 곧바로** — *immediately* 와 같은 뜻

## 문제 속 쓰임
> Let subagents call each other but add a lock so that two of them can never run the same search **at once**
> 서브에이전트끼리 서로 호출하게 두되, 두 서브에이전트가 같은 검색을 **동시에** 실행하지 못하도록 락을 추가한다

## 함께 쓰는 표현
- **all at once** : 한꺼번에 전부
- **one at a time** : 한 번에 하나씩 (반대 개념)

## 시험 포인트
서브에이전트끼리 직접 호출하며 중복 작업이 생길 때 락을 거는 것은 안티패턴입니다. 모든 통신·후속 작업 배분을 **코디네이터를 거치게(허브 앤 스포크)** 하는 것이 정답입니다.
