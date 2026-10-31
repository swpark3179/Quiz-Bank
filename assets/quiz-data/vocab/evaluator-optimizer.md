한 LLM 이 답을 **만들고**(optimizer), 다른 LLM 이 그 답을 **평가해 피드백을 주면**(evaluator) 다시 고쳐 쓰기를 반복하는 워크플로입니다. 핵심은 **생성 → 평가 → 재생성 루프**이며, 평가 기준이 분명하고 다듬을수록 나아지는 작업(번역·글쓰기 등)에 맞습니다.

## 문제 속 쓰임
> **Evaluator-optimizer**, because the draft is evaluated before it moves on to translation.
> **평가자-최적화자**다. 초안이 번역으로 넘어가기 전에 평가되기 때문이다.

## 함께 쓰는 표현
- **feedback loop** : 피드백을 받아 다시 고치는 반복 고리
- **critique and refine** : 비평하고 다듬다

## 비슷한 말 · 반대말
- **prompt chaining with a gate** — 단계 사이에 검사가 있어도 통과·반려만 하고 고쳐 쓰는 루프가 없으면 체이닝

## 시험 포인트
"검사 단계가 있다"는 이유만으로 고르면 함정입니다. 스크립트가 **통과·반려만** 하고 피드백으로 다시 생성하는 루프가 없다면 *evaluator-optimizer* 가 아니라 **게이트가 있는 프롬프트 체이닝**입니다.
