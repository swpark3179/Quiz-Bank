필수가 아니라 **있어도 되고 없어도 되는** 것입니다. 스키마에서는 `required` 에 넣지 않은 필드, 즉 값을 채우지 않아도 되는 필드를 가리킵니다.

## 문제 속 쓰임
> Add an "other" value to the enum plus an **optional** document_type_detail string so novel types are captured instead of misclassified.
> enum에 `"other"` 값과 **선택적** `document_type_detail` 문자열을 추가해, 새로운 유형이 잘못 분류되지 않고 포착되게 한다.

## 함께 쓰는 표현
- **optional field / parameter** : 선택 필드 / 선택 파라미터
- **optionally** (부) 원하면, 선택적으로

## 반대말
- **required**, **mandatory** — 반드시 있어야 하는

## 시험 포인트
목록 밖의 값이 기존 값으로 억지 분류된다면 enum 에 `"other"` + **선택적 상세 문자열 필드**를 두는 것이 정답 패턴입니다. 반대로 값이 없을 수 있는 필드를 필수로 두면 모델이 값을 지어내기 쉽습니다.
