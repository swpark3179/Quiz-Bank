결과나 행동을 **미리 내다볼 수 없는 정도**를 말합니다. 시스템 설계에서는 "같은 입력이라도 매번 어떤 경로·결과가 나올지 장담하기 어렵다"는 단점으로 자주 쓰입니다.

## 문제 속 쓰임
> Keep the existing pipeline, because it already meets the requirements and an agent would add latency, cost, and **unpredictability** without a measured benefit.
> 기존 파이프라인을 유지한다. 이미 요구사항을 충족하고 있고, 에이전트는 측정된 이득 없이 지연·비용·**예측 불가능성**만 더하기 때문이다.

## 함께 쓰는 표현
- **add unpredictability** : 예측 불가능성을 더하다
- **unpredictable behavior** : 예측할 수 없는 동작

## 비슷한 말 · 반대말
- **nondeterminism** — 비결정성 (같은 입력에도 결과가 달라질 수 있음)
- **predictability** — 예측 가능성

## 시험 포인트
에이전트는 모델이 경로를 정하므로 **지연·비용·예측 불가능성**을 대가로 치릅니다. 고정 단계로 이미 목표를 채우는 워크플로를 에이전트로 바꾸자는 보기는 거의 항상 오답이고, 현 구조를 유지하는 것이 정답입니다.
