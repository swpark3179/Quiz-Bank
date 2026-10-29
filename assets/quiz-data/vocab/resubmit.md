한 번 보냈던 요청·작업을 **다시 제출하는** 것입니다. 배치 처리에서는 실패한 항목만 골라 다시 넣을 때 자주 씁니다.

## 문제 속 쓰임
> **Resubmit** the entire 50,000-document batch, since Batch API jobs are atomic and cannot be reprocessed partially or selectively.
> Batch API 작업은 원자적이라 일부만 골라 재처리할 수 없으므로, 50,000건 배치 전체를 **다시 제출한다**

## 함께 쓰는 표현
- **resubmit only the failures** : 실패한 것만 다시 제출하다
- **resubmission** (명) 재제출

## 시험 포인트
Message Batches API 의 결과는 요청마다 `custom_id` 와 성공·오류 여부가 따로 나옵니다. 그래서 **`custom_id` 로 실패한 건만 골라 새 배치로 다시 제출**하는 보기가 정답이고, "배치는 원자적이라 전체를 다시 보내야 한다"는 보기는 오답입니다.
