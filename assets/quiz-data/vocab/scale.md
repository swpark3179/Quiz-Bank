1. **척도, 눈금** — 점수가 따르는 기준 범위와 그 의미 (*a 0–100 scale* 0~100 척도)
2. **규모** — 일의 크기 (*at scale* 대규모로)
3. **규모를 늘리다** — *scale up* (부하·사용량에 맞춰 키우다)

## 문제 속 쓰임
> Add worked examples of well-scored fields to the prompt so the model's numbers follow a consistent **scale**, then choose the cut-off from a quick read of a few sample outputs.
> 점수가 잘 매겨진 필드의 예시를 프롬프트에 넣어 숫자가 일관된 **척도**를 따르게 하고, 몇 개 샘플 출력을 훑어보고 기준값을 정한다.

## 함께 쓰는 표현
- **fixed scale definition** : 고정된 척도 정의
- **consistent scale** : 일관된 척도
- **at scale** : 대규모로

## 시험 포인트
이 보기는 오답입니다. 척도를 일관되게 만들어도 **그 점수가 실제로 얼마나 자주 맞는지**는 알 수 없습니다. 라벨된 검증 세트에서 점수 구간별 실제 정확도를 재서(보정) 기준값을 정해야 하고, 이를 위해 점수는 **필드마다** 같은 척도로 매겨야 합니다.
