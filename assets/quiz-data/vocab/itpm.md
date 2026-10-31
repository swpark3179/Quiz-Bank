**Input Tokens Per Minute** 의 줄임말로, **1분 동안 보낼 수 있는 입력 토큰 수의 상한**입니다. RPM(분당 요청 수)·OTPM(분당 출력 토큰)과 함께 사용 등급별 rate limit 을 이루고, 넘으면 429 를 받습니다.

## 문제 속 쓰임
> It is still well under its tier's published RPM, **ITPM**, and OTPM limits, yet it starts receiving 429 errors.
> 등급의 공개된 RPM·**ITPM**·OTPM 한도보다는 여전히 한참 아래인데도 429 오류를 받기 시작합니다.

## 함께 쓰는 표현
- **RPM** : 분당 요청 수 한도 · **OTPM** : 분당 출력 토큰 한도
- **rate limit** : 사용량 한도 (넘으면 429 `rate_limit_error`)
- **usage tier** : 사용 등급

## 시험 포인트
공개된 RPM·ITPM·OTPM 한도보다 한참 아래인데 트래픽이 **갑자기 급증한 직후** 429 가 난다면 가속 한도(*acceleration limits*) 때문입니다. 등급 상향이 아니라 트래픽을 **점진적으로 늘리는** 것이 정답이었습니다.
