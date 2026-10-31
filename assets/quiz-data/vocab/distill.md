1. **핵심만 추리다** — 긴 내용에서 요점만 뽑아 짧게 정리한다 (*distill the findings into a summary*)
2. **(모델을) 증류하다** — 큰 모델의 출력으로 작은 모델을 학습시켜, 능력을 더 작고 빠른 모델에 옮겨 담는다

## 문제 속 쓰임
> The bot will switch to a smaller **distilled** model, so review quality will drop slightly while latency improves.
> 봇이 더 작은 **증류** 모델로 바뀌므로 지연은 줄지만 리뷰 품질이 조금 떨어진다.

## 함께 쓰는 표현
- **distilled model** : 증류 모델
- **distill A into B** : A를 B로 압축·정리하다
- **distillation** : 증류

## 시험 포인트
fast mode 는 작은 증류 모델로 바꾸는 것이 아니라 **같은 모델**을 더 빠른 추론 구성으로 돌립니다. 능력은 그대로이고 출력 속도가 최대 약 2.5배 빨라지는 대신 토큰 단가가 더 비쌉니다.
