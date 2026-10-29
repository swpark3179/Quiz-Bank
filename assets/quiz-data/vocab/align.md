두 가지를 **서로 맞춰 대응시키는** 것입니다. 결과를 원본과 짝짓거나, 방향·기준을 일치시킬 때 씁니다.

## 문제 속 쓰임
> ...use response timestamps to **align** each result with its source document.
> 응답 타임스탬프로 각 결과를 원본 문서와 **맞춘다**

## 함께 쓰는 표현
- **align A with B** : A를 B에 맞추다
- **alignment** (명) 정렬, 일치; (AI) 모델이 사람의 의도·가치에 맞게 행동하도록 하는 것
- **misaligned** (형) 어긋난

## 시험 포인트
Batch API 결과는 순서나 시각으로 맞추는 것이 아니라 요청마다 붙인 **`custom_id`** 로 원본과 짝짓습니다. 실패한 건만 새 배치로 다시 보내면 됩니다.
