1. **(데이터의) 필드, 항목** — JSON 객체·스키마·DB 레코드 안에서 **이름이 붙은 값 하나**. *property*, *key* 와 거의 같은 뜻으로 씁니다
2. **분야** — *in the field of* ~ 분야에서

## 문제 속 쓰임
> Tool definitions are missing `required` **fields** in the JSON schema
> 도구 정의의 JSON 스키마에 `required` **필드**가 없다

## 함께 쓰는 표현
- **required field** : 필수 필드
- **nullable field** : null 을 허용하는 필드 (값이 없으면 null)
- **field name / value** : 필드 이름 / 값

## 시험 포인트
원문에 없는 값을 모델이 지어낸다면 그 필드를 **nullable** 로 만들고 "없으면 null" 을 지시하는 것이, 목록 밖 값이 억지로 분류된다면 enum 에 **"other" + 상세 문자열 필드**를 더하는 것이 정답 패턴입니다.
