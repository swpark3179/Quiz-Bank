서버가 응답에 실어 보내는 **"몇 초 뒤에 다시 시도하라"** 는 HTTP 헤더입니다. 429 같은 응답에 붙어 오며, 그보다 이른 재시도는 다시 실패합니다.

## 문제 속 쓰임
> A nightly batch job hits 429 rate_limit_error responses that carry a **retry-after** header of 20 seconds.
> 야간 배치 작업이 **retry-after** 헤더가 20초인 429 rate_limit_error 응답을 받는다.

## 함께 쓰는 표현
- **honor the retry-after header** : 헤더가 알려 준 시간을 지키다
- **exponential backoff** : 재시도 간격을 점점 늘리는 방식
- **tight retry loop** : 기다림 없이 바로 다시 보내는 루프

## 비슷한 말 · 반대말
- **backoff** — 물러서기. 실패가 반복될수록 대기 시간을 늘리는 것입니다

## 시험 포인트
*retry-after* 가 있는 429 는 **일시적 레이트 리밋**이므로 그 시간 이상 기다린 뒤 재시도하고, 반복되면 간격을 더 늘립니다. 반대로 헤더가 **없고** `enforced_spend_limit_reached` 코드가 붙은 429 는 지출 상한이라 재시도로 풀리지 않습니다.
