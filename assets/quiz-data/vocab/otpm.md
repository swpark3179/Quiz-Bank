**Output Tokens Per Minute** 의 줄임말로, **1분 동안 생성할 수 있는 출력 토큰 수의 상한**입니다. `max_tokens` 값이 아니라 실제로 생성된 토큰만 세며, RPM·ITPM 과 함께 사용 등급별 rate limit 을 이룹니다.

## 문제 속 쓰임
> It is still well under its tier's published RPM, ITPM, and **OTPM** limits, yet it starts receiving 429 errors.
> 등급의 공개된 RPM·ITPM·**OTPM** 한도보다는 여전히 한참 아래인데도 429 오류를 받기 시작합니다.

## 함께 쓰는 표현
- **RPM** : 분당 요청 수 한도 · **ITPM** : 분당 입력 토큰 한도
- **rate limit** : 사용량 한도 (넘으면 429)
- **acceleration limits** : 가속 한도. 사용량이 급격히 늘 때 걸리는 제한

## 시험 포인트
공개 한도 아래인데 **몇 분 사이 급증한 직후** 429 가 나면 가속 한도이고, 트래픽을 점진적으로 늘리는 것이 정답입니다. 529 `overloaded_error` 는 전체 사용자의 트래픽 때문에, 가속 한도의 429 는 **내 조직의 급증** 때문에 생긴다는 점도 구별합니다.
