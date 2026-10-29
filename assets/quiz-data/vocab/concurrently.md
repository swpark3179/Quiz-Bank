여러 작업이 **같은 시간대에 함께** 진행되는 것입니다. 하나가 끝나길 기다렸다가 다음을 시작하는 *sequentially* 와 반대입니다.

## 문제 속 쓰임
> Emit all three Task calls together in a single assistant response so the regional subagents run **concurrently**
> 세 Task 호출을 하나의 어시스턴트 응답에 함께 내보내, 지역별 서브에이전트가 **동시에** 실행되게 한다

## 함께 쓰는 표현
- **run concurrently** : 동시에 실행하다
- **concurrent** (형) 동시에 일어나는 · **concurrency** (명) 동시성

## 비슷한 말 · 반대말
- **in parallel** — 병렬로 (거의 같은 뜻으로 쓰임)
- **sequentially** — 순차적으로, 하나씩 차례로

## 시험 포인트
독립적인 하위 작업의 지연을 줄이려면 **한 응답에 여러 Task 호출을 함께 내보내** 동시에 돌리는 것이 정답입니다. 턴마다 하나씩 호출하면 순차 실행이 됩니다.
