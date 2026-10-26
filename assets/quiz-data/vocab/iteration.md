1. **(수정) 회차** — 결과를 보고 고쳐서 다시 시도하는 한 번
2. **(루프의) 반복 1회** — 같은 처리를 되풀이하는 한 바퀴

## 문제 속 쓰임
> What's the most effective approach for the next **iteration**?
> 다음 **회차**에서 가장 효과적인 접근은?
> Set a maximum **iteration** count (e.g., 10 calls) and stop when reached.
> 최대 **반복** 횟수(예: 10회)를 정해 두고 도달하면 멈춘다.

## 함께 쓰는 표현
- **iterate** (동) 반복하다, 고쳐 가며 다듬다 · **iterative** (형) 반복적인
- **iterate on** ~ : ~을 되풀이해 개선하다

## 시험 포인트
에이전트 루프를 멈추는 기준으로 **최대 반복 횟수**를 고르면 오답입니다. 그것은 무한 루프를 막는 안전장치일 뿐이고, 계속할지는 응답의 `stop_reason` 으로 판단합니다.
