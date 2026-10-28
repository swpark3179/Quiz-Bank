1. **확신도, 신뢰도 (점수)** — 모델·시스템이 자기 판단을 얼마나 확실하다고 보는지
2. **신뢰, 믿음** — 사람이 시스템을 믿는 마음 (*lose confidence in* ~)

## 문제 속 쓰임
> Keep all categories but display a **confidence** score with each finding.
> 모든 카테고리를 유지하되, 발견마다 **신뢰도** 점수를 표시한다.
> ...high false positive categories are undermining **confidence** in the accurate ones.
> 오탐이 많은 카테고리가 정확한 카테고리에 대한 **신뢰**까지 떨어뜨리고 있다.

## 함께 쓰는 표현
- **confidence score / threshold** : 신뢰도 점수 / 기준값
- **high-confidence** (형) 확신도가 높은 · **confident** (형) 확신하는

## 시험 포인트
LLM 이 **스스로 매긴 confidence 점수**로 자동 진행·필터링·에스컬레이션을 정하는 선택지는 대개 오답입니다. 자가 신뢰도는 보정이 부정확하기 때문입니다. 다만 걸러 내지 않고 **추론과 함께 옆에 보여 주는** 용도는 정답이 될 수 있습니다.
