이미 학습된 모델을 특정 데이터로 **추가 학습시켜 모델 자체를 바꾸는** 것입니다. 프롬프트나 예시를 고치는 것보다 데이터·비용·시간이 훨씬 많이 듭니다.

## 문제 속 쓰임
> The model requires more training data on multi-concept messages and should be **fine-tuned**.
> 모델에 다중 개념 메시지에 대한 학습 데이터가 더 필요하므로 **파인튜닝해야** 한다.

## 함께 쓰는 표현
- **fine-tuning** (명) 파인튜닝, 미세 조정
- **fine-tune a model on** ~ : ~ 데이터로 모델을 미세 조정하다

## 비교
- **prompting**, **few-shot** — 모델은 그대로 두고 입력만 바꾼다
- **fine-tuning** — 모델의 가중치 자체를 다시 학습시킨다

## 시험 포인트
증거가 프롬프트나 도구 설명 쪽 문제를 가리키는데 파인튜닝을 내세우는 선택지는 **과하고 비현실적인 해법**이라 오답이 되기 쉽습니다.
