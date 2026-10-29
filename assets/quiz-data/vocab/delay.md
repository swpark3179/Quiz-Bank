일이 예정보다 **늦어지게 하는 것, 또는 그 기다리는 시간**입니다. 재시도 문맥에서는 다음 시도까지 **일부러 두는 대기 시간**을 말합니다.

## 문제 속 쓰임
> Retry get_customer automatically in a tight loop until the database answers, with no upper bound on attempts or backoff **delay**.
> 데이터베이스가 응답할 때까지 시도 횟수 상한이나 백오프 **지연** 없이 `get_customer` 를 촘촘한 루프로 자동 재시도한다.

## 함께 쓰는 표현
- **backoff delay** : (재시도 전) 백오프 대기 시간
- **without delay** : 지체 없이
- **delayed** (형) 지연된

## 시험 포인트
상한·대기 없는 무한 재시도는 오답입니다. 일시 장애는 **`errorCategory`(transient)와 `isRetryable` 을 담은 구조화 오류**로 알려, 에이전트가 '조회 실패'와 '결과 없음'을 구분하게 하는 것이 정답입니다.
