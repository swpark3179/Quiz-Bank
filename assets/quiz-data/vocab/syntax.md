문장·코드가 **형식상 올바른지**를 정하는 규칙입니다. *syntax error* 는 괄호·따옴표가 빠지는 것처럼 **형식이 깨진** 오류로, 뜻이 틀린 것(*semantic error*)과는 다릅니다.

## 문제 속 쓰임
> Schema enforcement removes **syntax** and type errors but not semantic ones...
> 스키마 강제는 **구문** 오류와 타입 오류는 없애지만 의미 오류는 없애지 못한다

## 함께 쓰는 표현
- **syntax error** : 구문 오류
- **syntactically valid** : 구문상 올바른

## 비교
- **syntax** — 형식이 맞는가 (JSON 이 파싱되는가)
- **semantics** — 내용이 맞는가 (값이 사실·규칙과 맞는가)

## 시험 포인트
스키마 기반 구조화 출력은 **구문·타입**을 보장하지만 **의미**까지 보장하지는 않습니다. 합계 불일치 같은 문제는 별도 검증 단계로 잡습니다.
