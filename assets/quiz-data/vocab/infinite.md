**끝이 없는** 것입니다. 시스템에서는 종료 조건이 없어 **영원히 반복되는** 상황을 말할 때 주로 씁니다.

## 문제 속 쓰임
> After 3 hours in production, ops notices some claims are stuck in **infinite** loops consuming thousands of tokens.
> 운영 3시간 만에, 일부 청구 건이 **무한** 루프에 빠져 수천 토큰을 소모하는 것이 발견됐다.

## 함께 쓰는 표현
- **infinite loop** : 무한 루프
- **stuck in** ~ : ~에 빠져 벗어나지 못하다

## 비슷한 말
- **indefinitely** — 무기한으로, 끝없이 (부사)
- **endless** — 끝없는 (더 일상적)

## 시험 포인트
에이전트 루프가 무한 반복될 때는 **최대 반복 횟수(하드 상한)** 를 코드에 두는 것이 정답입니다. 프롬프트로 종료를 "요청"하거나 `max_tokens` 를 줄이는 보기는 오답입니다.
