모델이 다음 토큰을 고를 때 **얼마나 무작위로 고를지** 정하는 샘플링 값입니다. 낮을수록 늘 비슷한 답, 높을수록 다양한 답이 나옵니다.

## 문제 속 쓰임
> The model's **temperature** is too high; lower it to reduce hallucination
> **temperature**가 너무 높다 — 낮춰서 환각을 줄인다
> Lower **temperature** to 0 for deterministic output
> 결정적 출력을 위해 **temperature**를 0으로 낮춘다

## 함께 쓰는 표현
- **lower / raise the temperature** : temperature 를 낮추다 / 높이다
- **temperature 0** : 가장 결정적인 설정 (그래도 출력이 완전히 같다는 보장은 없음)

## 시험 포인트
temperature 조정 보기는 대부분 **오답 신호**입니다. 형식 오류·환각·분류 불일치·조사 범위 부족은 스키마 강제, 명확한 기준과 예시, 컨텍스트 관리처럼 원인을 직접 고치는 쪽이 정답입니다.
