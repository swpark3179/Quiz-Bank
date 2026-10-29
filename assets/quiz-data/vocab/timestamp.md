어떤 일이 **언제 일어났는지 적어 둔 시각 값**입니다. 로그·메시지·파일에 붙습니다.

## 문제 속 쓰임
> ...use response **timestamps** to align each result with its source document.
> 응답 **타임스탬프**로 각 결과를 원본 문서와 맞춘다

## 함께 쓰는 표현
- **timestamped log** : 시각이 찍힌 로그
- **ISO 8601 timestamp** : `2026-10-28T09:00:00Z` 같은 표준 시각 형식

## 시험 포인트
결과를 원본과 짝지을 때 타임스탬프나 순서에 기대는 보기는 오답입니다. 요청마다 붙인 **`custom_id`** 로 매칭합니다.
