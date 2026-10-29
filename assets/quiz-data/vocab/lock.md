여러 작업이 **같은 자원을 동시에 건드리지 못하게** 거는 잠금 장치입니다. 하나가 락을 잡고 있으면 다른 쪽은 풀릴 때까지 기다립니다.

## 문제 속 쓰임
> Let subagents call each other but add a **lock** so that two of them can never run the same search at once
> 서브에이전트끼리 서로 호출하게 두되, 두 서브에이전트가 같은 검색을 동시에 실행하지 못하도록 **락을** 추가한다

## 함께 쓰는 표현
- **acquire / release a lock** : 락을 잡다 / 풀다
- **lock file** : 의존성 버전을 고정해 두는 파일 (*package-lock.json*)
- **locked** (형) 잠긴, 고정된

## 시험 포인트
서브에이전트끼리 직접 호출하며 일이 겹칠 때 **락을 추가하는 것은 안티패턴**입니다. 모든 통신과 후속 작업 배분을 코디네이터가 맡는(허브 앤 스포크) 보기가 정답입니다.
