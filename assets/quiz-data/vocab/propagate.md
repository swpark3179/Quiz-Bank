1. **(오류·정보를) 전달하다** — 아래 단계에서 생긴 것을 호출한 쪽(위)으로 넘기다
2. **퍼뜨리다, 번식시키다**

## 문제 속 쓰임
> When designing error **propagation** to the coordinator, what approach enables the best recovery?
> 코디네이터로 오류를 **전달하는** 방식을 설계할 때, 가장 잘 복구할 수 있는 방법은?

## 함께 쓰는 표현
- **error propagation** : 오류를 상위로 전달하는 방식
- **propagate errors it cannot resolve** : 스스로 해결하지 못한 오류만 위로 넘기다

## 시험 포인트
좋은 오류 전달은 *무엇이 실패했고, 무엇을 시도했고, 어떤 부분 결과가 있는지* 를 함께 넘겨 **위에서 판단할 수 있게** 하는 것입니다.
