결과 자체 외에 덧붙이는 **설명·논평**입니다. 문제에서는 JSON 앞뒤에 붙는 군더더기 설명 문장을 말합니다.

## 문제 속 쓰임
> Add a stern system-prompt line ("Return only valid JSON, no markdown, no **commentary**") and set temperature to 0 for deterministic formatting.
> 시스템 프롬프트에 엄격한 한 줄("유효한 JSON만 반환, 마크다운·**덧붙이는 설명** 금지")을 추가하고, 결정적인 형식을 위해 temperature를 0으로 설정한다.

## 함께 쓰는 표현
- **no commentary** : 설명 없이 (결과만)
- **running commentary** : 실시간 해설

## 시험 포인트
"설명 없이 JSON만" 같은 프롬프트 강조와 `temperature` 0 으로는 형식을 **보장할 수 없습니다**. 도구 `input_schema` + `tool_choice` 강제(또는 structured outputs)로 출력을 스키마에 묶는 것이 정답입니다.
