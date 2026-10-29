함수·도구를 부를 때 **넘기는 입력 항목**입니다. 도구 정의에서는 `input_schema` 의 각 속성이 파라미터입니다.

## 문제 속 쓰임
> ...and occasionally swaps the `from` and `to` **parameters**.
> 가끔 `from` 과 `to` **파라미터**를 뒤바꾼다.

## 함께 쓰는 표현
- **required parameter** : 필수 파라미터
- **parameter description** : 파라미터 설명

## 비교
- **parameter** — 정의 쪽에 적힌 입력 항목(자리)
- **argument** — 호출할 때 실제로 넘긴 값

## 시험 포인트
모델이 형식이 틀린 값을 넣거나 파라미터를 뒤바꾸면, `required` 지정과 함께 **형식 예시·제약을 담아 설명을 보강**하는 보기가 정답입니다.
