함수·API·도구를 **부르는 쪽**입니다. 문제에서는 Claude API 를 호출하는 애플리케이션 코드를 가리킵니다.

## 문제 속 쓰임
> ...the **caller** still sends all six tools with tool_choice "auto", and in 9% of cases the model invokes the wrong extractor.
> ...**호출자**는 여전히 여섯 도구를 모두 보내고 `tool_choice` 를 `"auto"` 로 두며, 9%의 경우 모델이 엉뚱한 추출기를 호출합니다.

## 비교
- **caller** — 호출하는 쪽 · **callee** — 호출되는 쪽

## 시험 포인트
호출자가 어떤 도구를 써야 할지 **이미 안다면** `tool_choice: {"type": "tool", "name": ...}` 로 그 도구를 강제하는 것이 정답입니다. `auto` 는 모델이 판단, `any` 는 어떤 도구든 하나를 반드시 호출합니다.
