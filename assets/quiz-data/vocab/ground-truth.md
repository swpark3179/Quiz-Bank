모델의 예측이나 점수와 비교하는 **실제 정답**입니다. 사람이 직접 확인해 라벨을 붙인 데이터처럼, "실제로 맞는 값"으로 믿을 수 있는 기준을 말합니다.

## 문제 속 쓰임
> Compare the scores with **ground truth** on a labeled validation set and choose the threshold, per field if needed, from the measured accuracy
> 라벨된 검증 세트에서 점수를 **실제 정답**과 비교하고, 측정된 정확도를 보고 (필요하면 필드별로) 임계값을 고른다.

## 함께 쓰는 표현
- **labeled validation set** : 정답 라벨이 붙은 검증 세트
- **compare against ground truth** : 실제 정답과 대조하다

## 비슷한 말 · 반대말
- **golden answer** — 미리 정해 둔 모범 정답
- **self-reported confidence** — 모델이 스스로 매긴 확신도 (검증 전에는 정답의 근거가 아님)

## 시험 포인트
모델이 매긴 0.85 신뢰도는 "85% 맞다"는 뜻이 아닙니다. 자동 승인 임계값은 라벨된 검증 세트에서 *ground truth* 와 대조해 **측정한 정확도**로 정해야 합니다.
