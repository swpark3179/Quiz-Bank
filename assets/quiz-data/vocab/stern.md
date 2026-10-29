목소리를 높여 **엄하게 못 박는** 말투입니다. 문제에서는 프롬프트에 "~만 해라" 식으로 **강하게 적은 지시 한 줄**을 가리킵니다.

## 문제 속 쓰임
> Add a **stern** system-prompt line ("Return only valid JSON, no markdown, no commentary") and set temperature to 0 for deterministic formatting.
> 시스템 프롬프트에 **엄격한** 한 줄("Return only valid JSON, no markdown, no commentary")을 추가하고, 결정적인 형식을 위해 temperature를 0으로 설정한다

## 비슷한 말
- **strict** — 엄격한 (규칙을 엄하게 적용)
- **emphatic** — 강조하는, 힘주어 말하는

## 시험 포인트
"stern", "emphatic", "ALWAYS/NEVER" 같은 **강한 어조의 프롬프트 지시**는 여전히 확률적이라 형식을 보장하지 못합니다. JSON 형식이 꼭 맞아야 하면 도구 `input_schema` + `tool_choice` 강제 같은 구조적 방법이 정답입니다.
