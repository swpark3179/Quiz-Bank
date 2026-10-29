같은 말을 되풀이해 **항상 참이 되는** 것입니다. 테스트에서는 `assert x == x` 처럼 **무엇을 넣어도 통과해 실제로는 아무것도 검증하지 않는** 단언을 말합니다.

## 문제 속 쓰임
> ...audits show 20% of the generated tests have weak or **tautological** assertions.
> 감사 결과 생성된 테스트의 20%에 약하거나 **동어반복적인** assertion이 있었다.

## 함께 쓰는 표현
- **tautological assertion / test** : 늘 통과하는 의미 없는 단언 / 테스트
- **tautology** (명) 동어반복

## 시험 포인트
같은 세션이 자기가 만든 테스트를 리뷰하면 자기 결과에 치우쳐 이런 결함을 못 봅니다. **별도의 독립 Claude 인스턴스**로 리뷰하는 것이 정답입니다.
