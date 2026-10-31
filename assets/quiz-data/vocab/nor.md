앞의 부정에 이어 "**~도 아니다**"를 덧붙이는 말입니다. *neither A nor B* 꼴로 가장 많이 쓰며, **A와 B 둘 다를 부정**합니다.

## 문제 속 쓰임
> It drops the constraint entirely, so neither Claude **nor** your code ever checks that `quantity` is at least 100.
> 제약을 완전히 버리므로, `quantity` 가 100 이상인지는 **Claude도 코드도** 확인하지 않는다

## 함께 쓰는 표현
- **neither A nor B** : A도 B도 아니다
- **nor do I** : 나도 그렇지 않다 (앞의 부정에 맞장구)

## 비슷한 말 · 반대말
- **either A or B** — A 아니면 B. 둘 중 하나는 맞는다는 구조

## 시험 포인트
*neither A nor B* 는 둘 다 아니라는 강한 주장이라, 하나라도 해당하면 틀린 문장입니다. SDK 도우미는 `minimum` 제약을 설명으로 옮겨 Claude 에게 알리고 응답을 직접 검증하므로 위 보기는 **오답**입니다.
