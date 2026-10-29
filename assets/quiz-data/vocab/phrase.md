1. **문구, 구절** — 몇 단어로 된 말 덩어리 (*closing phrase*: 마무리 문구)
2. **(말로) 표현하다** — *phrasing* 은 "표현 방식, 문구 선택"

## 문제 속 쓰임
> ...it ends whenever the latest assistant text contains the **phrase** 'research complete'.
> 최신 어시스턴트 텍스트에 'research complete'라는 **문구**가 들어 있으면 루프를 끝내도록 되어 있다.

## 함께 쓰는 표현
- **closing phrase** : 마무리 문구
- **rephrase** (동) 바꿔 말하다

## 시험 포인트
특정 **문구 매칭**으로 에이전트 루프 종료를 판단하는 보기는 오답입니다. `stop_reason` 이 `tool_use` 면 도구를 실행하고 계속, `end_turn` 이면 종료하는 보기가 정답입니다.
