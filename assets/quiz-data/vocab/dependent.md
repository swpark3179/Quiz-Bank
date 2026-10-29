다른 것에 **기대고 있어서 그것이 바뀌면 함께 영향을 받는** 상태입니다. 코드에서는 어떤 정의(타입·함수)를 **사용하는 쪽**을 가리킵니다.

## 문제 속 쓰임
> Batch the three interacting changes into a single message so Claude edits the enum and all **dependent** switch sites together
> 서로 얽힌 세 변경을 하나의 메시지로 묶어, Claude가 enum과 이에 **의존하는** 모든 switch 지점을 함께 수정하게 한다

## 함께 쓰는 표현
- **dependent on** ~ : ~에 의존하는, ~에 따라 달라지는
- **interdependent** : 서로 의존하는

## 반대말
- **independent** — 독립적인

## 시험 포인트
변경들이 같은 타입·코드 경로를 공유해 **서로 영향을 주면 한 메시지로 묶고**, 서로 독립적이면 순차 처리하는 것이 정답입니다.
