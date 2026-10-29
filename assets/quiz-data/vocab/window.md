1. **(컨텍스트) 창** — *context window*: 모델이 한 번에 읽고 기억할 수 있는 토큰의 범위
2. **(시간의) 구간** — *time window* 정해진 시간 범위
3. **(화면의) 창** — 앱·브라우저 창

## 문제 속 쓰임
> Context **window** saturation — the cumulative message history exceeds the effective attention range...
> 컨텍스트 **윈도** 포화 — 누적 대화 기록이 실질적인 주의 범위를 넘었다...

## 함께 쓰는 표현
- **context window size** : 컨텍스트 창 크기
- **sliding window** : 최근 일정 범위만 남기며 밀어 가는 방식

## 시험 포인트
"컨텍스트 창을 늘린다"는 보기는 대부분 오답입니다. 요약 손실·탐색 출력 오염·형식 혼란 같은 **원인이 그대로** 남기 때문이고, 압축·외부 파일·서브에이전트 격리 같은 구조적 해법이 정답 쪽입니다.
