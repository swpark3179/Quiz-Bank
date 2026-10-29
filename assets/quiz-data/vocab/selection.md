여럿 가운데 **고르는 일, 선택**입니다. 시험에서는 *tool selection*(어떤 도구를 부를지 고르는 것)으로 자주 나옵니다.

## 문제 속 쓰임
> Force the known extractor with tool_choice {"type": "tool", "name": "extract_invoice"} rather than leaving **selection** to "auto".
> **선택**을 `"auto"` 에 맡기지 말고 `tool_choice` `{"type": "tool", "name": "extract_invoice"}` 로 이미 알고 있는 추출기를 강제한다

## 함께 쓰는 표현
- **tool selection** : 도구 선택
- **model selection** : 모델 선택

## 시험 포인트
도구 선택 오류는 `max_tokens` 를 늘려서는 해결되지 않습니다. 설명을 명확히 하거나 도구 수를 줄이고, 어떤 도구를 쓸지 **이미 정해져 있다면 강제 지정**하는 보기가 정답입니다.
