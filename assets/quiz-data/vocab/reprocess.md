한 번 처리한 데이터를 **다시 처리하는** 것입니다. 실패한 건만 골라 다시 돌리는 상황에 자주 씁니다.

## 문제 속 쓰임
> The team needs to **reprocess** only the failures and reliably match every result back to its source document.
> 팀은 실패한 건만 **다시 처리하면서** 모든 결과를 원본 문서와 확실하게 매칭해야 한다.

## 함께 쓰는 표현
- **reprocess failures** : 실패 건을 재처리하다
- **reprocessing** (명) 재처리

## 시험 포인트
Message Batches API 결과는 **순서가 보장되지 않으므로** 각 요청의 `custom_id` 로 매칭하고, 실패한 `custom_id` 만 모아 새 배치로 **재처리**하는 보기가 정답입니다.
