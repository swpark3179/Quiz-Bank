어떤 결과가 다른 것에 **달려 있다(좌우된다)** 거나 그것에 **의존한다**는 뜻입니다. 거의 항상 *depend on* ~ 형태로 씁니다.

## 문제 속 쓰임
> ...must call classify_document before running any field extraction, because the extraction schema **depends** on the detected type.
> 추출 스키마가 감지된 문서 유형에 **따라 달라지므로**, 필드 추출을 하기 전에 반드시 `classify_document` 를 호출해야 합니다.

## 함께 쓰는 표현
- **depend on** ~ : ~에 달려 있다, ~에 의존하다
- **depending on** ~ : ~에 따라
- **dependent** (형) 의존하는 · **dependency** (명) 의존 관계

## 시험 포인트
반드시 먼저 실행해야 하는 도구가 **항상 같은 하나**라면, 프롬프트 지시 대신 첫 턴에 `tool_choice: {"type":"tool","name":...}` 로 그 도구를 강제하는 것이 정답입니다.
