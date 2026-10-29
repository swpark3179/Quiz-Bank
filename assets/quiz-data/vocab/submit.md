양식·요청·작업을 **처리해 달라고 넘기는** 것입니다. API 에서는 배치(batch)나 작업을 "제출한다"고 할 때 씁니다.

## 문제 속 쓰임
> ...match results by it, and **submit** a new batch of only the 300 failures.
> 그것으로 결과를 매칭하고, 실패한 300건만 담은 새 배치를 **제출한다**

## 함께 쓰는 표현
- **submit a batch / request** : 배치·요청을 제출하다
- **resubmit** : 다시 제출하다
- **submission** (명) 제출(물)

## 시험 포인트
Message Batches 결과는 순서가 보장되지 않으므로 `custom_id` 로 매칭하고, **실패한 요청만 골라 새 배치로 다시 제출**하는 보기가 정답입니다.
