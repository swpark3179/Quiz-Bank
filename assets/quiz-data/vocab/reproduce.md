같은 조건을 만들어 **똑같은 현상이 다시 일어나게 하는(재현하는)** 것입니다. 형용사 *reproducible* 은 "재현 가능한".

## 문제 속 쓰임
> The engineering team cannot **reproduce** bugs because they have no visibility into which tools were called, in what order, with what inputs...
> 어떤 도구가 어떤 순서로, 어떤 입력으로 호출됐는지 볼 수 없어서 버그를 **재현하지** 못한다.

## 함께 쓰는 표현
- **reproduce a bug** : 버그를 재현하다
- **steps to reproduce** : 재현 절차
- **reproducible results** : 재현 가능한 결과

## 시험 포인트
버그를 재현할 수 없다면 `temperature=0` 이 아니라 **단계별 구조화된 트레이스 로깅**(요청, `stop_reason`, 도구 입출력, 상관 ID)이 최소한의 관측성입니다.
