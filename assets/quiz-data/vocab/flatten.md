여러 겹으로 **중첩된 구조를 한 층으로 평평하게 펼친다**는 말입니다. 스키마에서는 객체 안에 객체가 거듭 들어간 깊은 중첩을 줄여, 필드를 얕은 단계에 나란히 두는 것을 가리킵니다.

## 문제 속 쓰임
> Simplify and **flatten** the schema, and make fields optional wherever the task may not find that information.
> 스키마를 단순하고 **평평하게** 만들고, 작업이 그 정보를 찾지 못할 수 있는 곳의 필드는 선택(optional)으로 바꾼다.

## 함께 쓰는 표현
- **flatten the schema** : 스키마의 중첩을 줄이다
- **flat structure** : 평평한(중첩 없는) 구조

## 비슷한 말 · 반대말
- **nested / deeply nested** — 중첩된 / 깊게 중첩된

## 시험 포인트
Agent SDK에서 `error_max_structured_output_retries` 가 잦으면 스키마를 **단순화·flatten** 하고 없을 수 있는 필드를 선택으로 바꿉니다. `max_tokens` 를 올리거나 재실행하는 보기는 함정입니다.
