내용의 **시작과 끝, 또는 항목 사이의 경계를 표시하는** 기호나 태그입니다. 프롬프트에서는 `<example>` 같은 XML 태그나 백틱 세 개가 지시·예시·데이터를 서로 나누는 역할을 합니다.

## 문제 속 쓰임
> Place the examples after the input with no **delimiters**, so that the model treats them as part of the task.
> 예시를 **구분자** 없이 입력 뒤에 두어 모델이 예시를 작업의 일부로 다루게 한다.

## 함께 쓰는 표현
- **XML tags as delimiters** : 구분자로 쓰는 XML 태그
- **break out of the delimiter** : 구분자를 닫고 빠져나가다 (인젝션 수법)

## 비슷한 말 · 반대말
- **separator** — 구분 기호 (쉼표·탭처럼 항목 사이를 나누는 것)

## 시험 포인트
예시는 `<example>` 태그 같은 *delimiters* 로 감싸 지시·입력과 구분하는 것이 권장 방식입니다. 반면 인젝션의 구분자 탈출을 막는 문항에서 *delimiter* 를 다른 기호로 바꾸는 보기는 오답이고, 정답은 `tool_result` 안에 **JSON 문자열로 인코딩**해 넣는 것입니다.
