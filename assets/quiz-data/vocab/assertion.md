1. **(테스트) 단언문** — 결과가 기대값과 맞는지 확인하는 검사 코드 (`assert x == 3`)
2. **주장, 단언** — 일반 영어에서 "사실이라고 강하게 말함"

## 문제 속 쓰임
> The review almost never finds problems, yet audits show 20% of the generated tests have weak or tautological **assertions**.
> 리뷰는 거의 문제를 찾지 못하지만, 감사 결과 생성된 테스트의 20%에 약하거나 동어반복적인 **assertion**이 있었습니다.

## 함께 쓰는 표현
- **weak assertion** : 거의 아무것도 검증하지 않는 단언 (`assert result is not None`)
- **tautological assertion** : 항상 참이라 의미 없는 단언 (`assert x == x`)
- **assert** (동) 단언하다, 확인하다

## 시험 포인트
테스트를 **만든 세션이 스스로 리뷰**하면 자기 결과물에 관대해 약한 assertion 을 놓칩니다. 컨텍스트를 공유하지 않는 **독립 인스턴스**로 리뷰하는 것이 정답입니다.
