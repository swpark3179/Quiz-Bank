1. **(과정·루프를) 구동하다, 이끌다** — 무엇을 기준으로 다음 단계로 넘어갈지 정하는 것
2. **~-driven** : ~에 따라 움직이는 (*data-driven*, *event-driven*)

## 문제 속 쓰임
> What is the correct way to **drive** the agentic loop?
> 에이전트 루프를 올바르게 **구동하는** 방법은 무엇일까요?
> How should loop termination be **driven**?
> 루프 종료를 **판단하는** 올바른 기준은 무엇일까요?

## 함께 쓰는 표현
- **drive the loop** : 루프를 진행시키다
- **schema-driven / event-driven** : 스키마·이벤트에 따라 동작하는

## 시험 포인트
에이전트 루프는 응답 텍스트의 문구가 아니라 **`stop_reason`** 으로 구동합니다. `"tool_use"` 면 도구를 실행해 결과를 돌려주고 계속, `"end_turn"` 이면 종료합니다. 텍스트 매칭으로 끝내는 보기는 오답입니다.
