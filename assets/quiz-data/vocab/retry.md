실패한 요청·작업을 **다시 시도하는** 것입니다. 명사로는 재시도 한 번을 가리키고, *retries* 는 재시도(횟수)를 말합니다.

## 문제 속 쓰임
> **Retry** get_customer automatically in a tight loop until the database answers, with no upper bound on attempts or backoff delay.
> 데이터베이스가 응답할 때까지 시도 횟수 상한이나 백오프 지연 없이 `get_customer` 를 촘촘한 루프로 자동 **재시도한다**

## 함께 쓰는 표현
- **retry with backoff** : 간격을 늘려 가며 재시도하다 (→ exponential backoff)
- **max retries / retry limit** : 최대 재시도 횟수
- **retryable** (형) 재시도해도 되는 — *isRetryable* 필드

## 시험 포인트
재시도는 **일시적(transient) 오류**에만 의미가 있고, 상한과 백오프를 함께 둬야 합니다. 정책상 거절이나 원문에 정보가 아예 없는 경우는 몇 번을 해도 같으므로 멈추고 넘겨야 하며, 검증 실패라면 같은 프롬프트를 반복하기보다 **오류 내용을 붙여 다시 요청**하는 쪽이 정답입니다.
