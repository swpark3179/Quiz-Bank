데이터가 **어떤 필드를 어떤 타입·형식으로** 가져야 하는지 정해 둔 정의입니다. 도구 입력, 구조화 출력, DB 테이블 등에 씁니다.

## 문제 속 쓰임
> Use a tool definition with the invoice **schema** and `tool_choice: any` to force **schema-compliant** extraction
> 송장 **스키마**를 담은 도구 정의와 `tool_choice: any` 를 써서 **스키마에 맞는** 추출을 강제한다

## 함께 쓰는 표현
- **JSON schema** : JSON 스키마
- **schema-compliant / schema-valid** : 스키마를 지킨
- **nullable field** : null 을 허용하는 필드

## 시험 포인트
스키마는 **구문·타입 오류만** 없애 줄 뿐, 합계가 안 맞는 것 같은 **의미 오류는 못 막습니다** — 별도 검증이 필요합니다. 원문에 없는 값을 지어내는 문제는 그 필드를 **nullable** 로 만들고 "없으면 null"을 허용하는 것이 스키마 수준의 정답입니다.
