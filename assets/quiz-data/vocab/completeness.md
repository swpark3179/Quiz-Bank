필요한 요소가 **하나도 빠짐없이 갖춰진** 정도입니다. 정확성과는 다른 기준이라, **맞는 말만 했어도 빠진 내용이 있으면** completeness 가 낮습니다.

## 문제 속 쓰임
> Add a self-critique step where the agent evaluates its draft response for **completeness**.
> 에이전트가 초안 응답에 **빠진 내용이 없는지** 스스로 평가하는 자기 비평 단계를 추가한다.

## 비교
- **accuracy / correctness** — 내용이 *맞는가*
- **completeness** — 필요한 내용이 *다 들어 있는가*

## 시험 포인트
해결은 정확한데 설명에서 빠지는 부분이 **케이스마다 다를 때**는, 고정된 few-shot 이나 모델 상향보다 초안을 기준에 비춰 **completeness 를 점검하는 자기 비평 단계**가 정답으로 나옵니다.
