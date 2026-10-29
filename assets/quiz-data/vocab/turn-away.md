찾아온 사람을 **받아 주지 않고 돌려보내는** 것입니다. 문제에서는 실제 계정이 있는 고객이 "계정이 없다"는 잘못된 답을 듣고 **도움을 받지 못한 채 끝나는** 상황을 말합니다.

## 문제 속 쓰임
> Real accounts are being **turned away** during transient outages.
> 일시적인 장애 동안 실제 계정이 있는 고객들이 **돌려보내지고** 있다.

## 함께 쓰는 표현
- **turn away a customer / request** : 고객·요청을 돌려보내다
- **be turned away** : 거절당하다, 들어가지 못하다

## 비슷한 말
- **reject**, **refuse** — 거절하다 (더 직접적인 말)

## 시험 포인트
원인은 도구가 **접속 실패를 빈 결과처럼 숨긴 것**입니다. `errorCategory`(예: transient)·`isRetryable` 을 담은 구조화된 오류로 "접근 실패"와 "결과 없음"을 구분하는 보기가 정답입니다.
