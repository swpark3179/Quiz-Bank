정해진 시간 동안 보낼 수 있는 **요청 수·토큰 수의 상한**입니다. Claude API 에는 분당 요청(RPM)·입력 토큰(ITPM)·출력 토큰(OTPM) 한도가 있고, 넘으면 429 `rate_limit_error` 를 받습니다.

## 문제 속 쓰임
> It is accepted, but its requests use up the Messages API **rate limits**, so the team should pause synchronous traffic while it runs
> 받아들여지지만 요청이 Messages API **레이트 리밋**을 소모하므로, 실행되는 동안 동기 트래픽을 멈춰야 한다.

## 함께 쓰는 표현
- **hit a rate limit** : 요청 한도에 걸리다
- **rate-limited** : 한도에 걸린, 속도 제한된
- **RPM / ITPM / OTPM limits** : 분당 요청·입력 토큰·출력 토큰 한도

## 비슷한 말 · 반대말
- **spend limit** — 지출 한도. 요청 수가 아니라 **금액** 기준입니다
- **acceleration limit** — 가속 한도. 사용량이 급격히 늘 때 걸립니다

## 시험 포인트
이 보기는 오답입니다. **Batches API 사용량은 Messages API 레이트 리밋에 영향을 주지 않습니다.** 이 문항의 실제 원인은 배치 하나의 크기 한도(요청 100,000건 또는 256 MB 중 먼저 닿는 쪽)를 넘어 413 으로 거부되는 것입니다.
