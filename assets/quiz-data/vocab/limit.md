**넘을 수 없게 정해 둔 한도**(명사), 또는 범위를 **제한하는** 것(동사)입니다. *limited to* ~ 는 "~로 제한된"입니다.

## 문제 속 쓰임
> The `max_tokens` **limit** is too low, truncating the tool call
> `max_tokens` **한도**가 너무 낮아 도구 호출이 잘린다
> Subagent context is **limited** to 10k tokens regardless of model
> 서브에이전트 컨텍스트는 모델과 무관하게 1만 토큰으로 **제한된다**

## 함께 쓰는 표현
- **token limit** : 토큰 한도
- **limit A to B** : A를 B로 제한하다 (*limit the tool configuration to the few tools its role needs*)
- **limitation** (명) 한계, 제약

## 시험 포인트
서브에이전트에 **필요한 도구만 남기도록 제한**하는 것은 도구 선택 오류를 줄이는 정답 패턴입니다. 반면 "서브에이전트는 1만 토큰으로 제한된다" 같은 **지어낸 한도**는 오답입니다.
