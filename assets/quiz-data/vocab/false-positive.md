실제로는 문제가 아닌데 **문제라고 잘못 판정한 것**(오탐)입니다. 반대로 진짜 문제를 놓친 것은 *false negative*(미탐)라고 합니다.

## 문제 속 쓰임
> Your automated code review averages 15 findings per PR, with a 40% **false positive** rate.
> 자동 코드 리뷰가 PR당 평균 15개의 지적을 내고, **오탐**률은 40%다.

## 함께 쓰는 표현
- **false positive rate** : 오탐률
- **reduce false positives** : 오탐을 줄이다
- **high-precision** : 오탐이 적은, 정밀도가 높은

## 비교
- **true positive** — 진짜 문제를 맞게 잡음
- **false positive** — 문제가 아닌데 잡음 (오탐)
- **false negative** — 진짜 문제를 놓침 (미탐)

## 시험 포인트
오탐 문제에서는 **제약 조건**을 먼저 확인하세요. 필터링이 금지됐다면 걸러 내지 말고 추론·신뢰도를 함께 보여 주는 보기, 특정 카테고리만 오탐이 높다면 그 카테고리만 **잠시 끄는** 보기가 정답입니다. 모든 카테고리를 똑같이 완화하는 보기는 오답입니다.
