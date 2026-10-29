1. **결과, 결괏값** — 어떤 동작이나 도구 실행이 돌려준 값
2. **(~의) 결과로 생기다** — *result in* ~을 낳다, *result from* ~에서 비롯되다

## 문제 속 쓰임
> ...a tool returning ambiguous **results** can cause the model to keep requesting the same tool indefinitely
> 도구가 모호한 **결과**를 반환하면 모델이 같은 도구를 끝없이 재요청할 수 있다

## 함께 쓰는 표현
- **tool result** : 도구 실행 결과 — API에서는 `tool_result` 블록으로 돌려준다
- **result in** ~ : ~이라는 결과를 낳다
- **resulting** (형) 그 결과로 생긴

## 시험 포인트
에이전트 루프에서는 도구를 실행한 뒤 그 결과를 `tool_use_id` 를 맞춘 **`tool_result` 블록**으로 다음 요청에 붙여 돌려줘야 모델이 이어서 판단합니다.
