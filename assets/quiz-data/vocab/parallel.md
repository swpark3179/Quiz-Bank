여러 작업을 **동시에 나란히 진행하는** 것입니다. *in parallel* 은 "병렬로, 동시에"라는 부사구로 자주 씁니다.

## 문제 속 쓰임
> ...then spawns subagents to check order history and refund eligibility **in parallel**.
> 주문 이력과 환불 자격을 **병렬로** 확인하는 서브에이전트들을 생성한다.

## 함께 쓰는 표현
- **run in parallel** : 병렬로 실행하다
- **parallel tool calls** : (한 응답 안의) 병렬 도구 호출
- **parallelize** (동) 병렬화하다

## 반대말
- **sequential**, **in sequence** — 순차적인, 하나씩 차례로

## 시험 포인트
독립적인 하위 작업의 지연을 줄이려면 **한 응답에 여러 Task 호출을 함께 내보내** 병렬로 실행합니다. 병렬 서브에이전트도 부모 컨텍스트를 물려받지 않으므로, 확인된 사실은 각 Task 프롬프트에 명시해야 합니다.
