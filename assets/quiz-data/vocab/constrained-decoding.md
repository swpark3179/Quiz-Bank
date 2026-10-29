모델이 토큰을 하나씩 고를 때 **정해진 스키마·문법을 어기는 토큰은 아예 고르지 못하게 막는** 생성 방식입니다. 그래서 출력 형식이 프롬프트 지시보다 **훨씬 강하게 보장**됩니다.

## 해설 속 쓰임
> 지금의 Claude API에는 **constrained decoding** 기반 Structured Outputs(`output_config.format` 에 `json_schema` 지정)도 정식 제공됩니다.

## 함께 쓰는 표현
- **structured outputs** : 스키마에 맞는 구조화 출력 기능
- **strict tool use** : 도구에 `strict: true` 를 줘 입력이 스키마를 따르게 하기

## 시험 포인트
형식 준수를 **보장**해야 하는 문제에서는 "JSON으로만 답하라" 같은 프롬프트 지시가 아니라, 도구 스키마 강제나 Structured Outputs 같은 **API 수준의 장치**가 정답입니다.
