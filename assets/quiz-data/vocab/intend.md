어떤 **결과를 노리고** 무언가를 한다는 뜻입니다. 문제에서는 "원래 노린 것"과 "실제로 일어난 일"이 어긋나는 상황을 설명할 때 자주 나옵니다.

## 문제 속 쓰임
> An architect writes a PreToolUse hook with the regex matcher `/refund/` **intending** it to gate a single custom tool named `refund`.
> 아키텍트가 `refund` 라는 커스텀 도구 하나만 막을 **의도로** 정규식 matcher `/refund/` 로 PreToolUse 훅을 작성합니다.

## 함께 쓰는 표현
- **intend A to** ~ : A가 ~하도록 의도하다
- **intended for** ~ : ~용으로 만든, ~을 위한
- **unintended** : 의도하지 않은 (*unintended patterns* 의도치 않은 패턴)

## 비슷한 말 · 반대말
- **mean to** ~ — ~할 생각이다 (더 일상적인 말)

## 시험 포인트
*intending* 이 나오면 **의도와 실제 동작의 차이**를 찾으라는 신호입니다. 고정하지 않은 정규식 `/refund/` 는 `issue_refund_note` 에도 걸리므로, `/^refund$/` 로 고정하는 것이 정답이었습니다.
