1. **(명) 형식, 서식** — 날짜 형식(ISO, 미국식), 출력 형식(JSON, 마크다운)처럼 데이터를 나타내는 정해진 모양
2. **(동) 형식에 맞게 정리하다** — *formatting* 은 "서식 지정"

## 문제 속 쓰임
> get_customer and lookup_order call two different backend systems that return dates in different **formats**...
> `get_customer` 와 `lookup_order` 는 서로 다른 두 백엔드 시스템을 호출하는데, 두 시스템은 날짜를 서로 다른 **형식**(ISO와 미국식)으로 반환한다.

## 함께 쓰는 표현
- **date format** : 날짜 형식
- **output format** : 출력 형식 (`--output-format json`)
- **format examples** : 형식 예시 (도구 description 에 넣는 입력 예)

## 시험 포인트
도구마다 **형식이 달라** 모델이 잘못 읽는다면, 프롬프트 지시가 아니라 **PostToolUse 훅으로 출력을 하나의 표준 형식으로 정규화**하는 보기가 정답입니다.
