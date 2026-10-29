질문·요청에 **답하거나 반응하는** 것입니다. *respond with* 뒤에는 답의 형식이, *respond to* 뒤에는 답하는 대상이 옵니다.

## 문제 속 쓰임
> The system prompt says 'Always **respond** with valid JSON'.
> 시스템 프롬프트에는 "항상 유효한 JSON으로 **응답하라**"고 되어 있다.

## 함께 쓰는 표현
- **respond with JSON** : JSON 으로 응답하다
- **respond to a request** : 요청에 응답하다
- **respond directly** : (도구 없이) 바로 답하다

## 시험 포인트
"항상 JSON 으로 응답하라" 같은 **프롬프트 지시만으로는** 형식이 보장되지 않습니다. 스키마를 담은 **도구 정의 + `tool_choice`** 로 강제하는 보기가 가장 확실한 구조화 출력입니다.
