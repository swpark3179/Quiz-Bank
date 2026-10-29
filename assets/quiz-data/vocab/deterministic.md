같은 입력이면 **언제나 같은 결과가 나오는** 성질입니다. 시험에서는 모델의 확률적 판단에 맡기지 않고 **코드·설정이 정해진 대로 강제**한다는 뜻으로 아주 자주 나옵니다.

## 문제 속 쓰임
> Use `temperature=0` to make runs **deterministic** and reproducible
> `temperature=0` 으로 실행을 **결정적**·재현 가능하게 만든다

## 함께 쓰는 표현
- **deterministic control / enforcement** : 결정적 통제·강제 (hooks, 권한 규칙, `tool_choice`)
- **deterministically** (부) 결정적으로, 항상 정해진 대로

## 반대말
- **probabilistic**, **non-deterministic** — 확률적인, 비결정적인 (프롬프트 지시, 모델의 자연어 판단)

## 시험 포인트
"반드시·매번·절대"를 보장해야 하면 프롬프트 지시가 아니라 **훅·권한 규칙·스키마·`tool_choice` 같은 결정적 수단**이 정답입니다. 반면 `temperature=0` 은 완전한 결정성을 보장하지 않고 근본 원인도 고치지 못해 오답이 되기 쉽습니다.
