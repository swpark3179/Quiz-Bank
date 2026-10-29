작업이 **전부 성공하거나 전부 실패할 뿐 중간 상태가 없는** 것, 즉 더 쪼갤 수 없는 한 단위로 처리된다는 뜻입니다.

## 문제 속 쓰임
> Resubmit the entire 50,000-document batch, since Batch API jobs are **atomic** and cannot be reprocessed partially or selectively.
> Batch API 작업은 **원자적**이라 일부만 골라 재처리할 수 없으므로, 50,000건 배치 전체를 다시 제출한다

## 함께 쓰는 표현
- **atomic operation / transaction** : 원자적 연산 / 트랜잭션
- **atomic commit** : 한 가지 변경만 담은 작은 커밋
- **atomicity** (명) 원자성

## 시험 포인트
"Batch API 작업은 원자적이다"는 **사실과 다른** 보기입니다. 배치 안의 요청은 각각 따로 성공·실패하므로 **`custom_id`** 로 결과를 맞추고, 실패한 것만 새 배치로 다시 보냅니다.
