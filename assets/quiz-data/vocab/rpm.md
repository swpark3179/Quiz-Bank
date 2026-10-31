**Requests Per Minute** 의 줄임말로, **1분 동안 보낼 수 있는 요청 수의 상한**입니다. 입력 토큰 한도 ITPM, 출력 토큰 한도 OTPM 과 함께 사용 등급(tier)별로 공개됩니다.

## 문제 속 쓰임
> It is still well under its tier's published **RPM**, ITPM, and OTPM limits, yet it starts receiving 429 errors.
> 등급의 공개된 **RPM**·ITPM·OTPM 한도보다는 여전히 한참 아래인데도 429 오류를 받기 시작한다.

## 함께 쓰는 표현
- **RPM limit** : 분당 요청 수 한도
- **ITPM / OTPM** : 분당 입력 토큰 / 출력 토큰 한도
- **requests per minute** : 분당 요청 수 (풀어 쓴 형태)

## 비슷한 말 · 반대말
- **rate limit** — 요청 한도 전체를 가리키는 말. RPM 은 그중 하나입니다

## 시험 포인트
**RPM 한도 아래인데 급증 직후 429** 가 나면 가속 한도이므로 트래픽을 점진적으로 늘립니다. 또 한도는 토큰 버킷 방식이라 60 RPM 이 초당 1건처럼 짧은 간격으로 적용될 수 있어, **짧은 폭주만으로도** 429 가 날 수 있습니다.
