1. **(특수 문자를) 이스케이프하다** — 따옴표·태그 같은 문법 기호에 표시를 붙여, 구조가 아닌 **평범한 글자로 읽히게** 바꿔 적는다 (`"` → `\"`)
2. **벗어나다, 빠져나가다** — 갇힌 곳이나 정해진 경계를 뚫고 나간다

## 문제 속 쓰임
> Deliver the ticket as a JSON object inside the tool_result, with the body as an **escaped** JSON string and fields naming its source.
> 티켓을 tool_result 안의 JSON 객체로 전달하되, 본문은 **이스케이프된** JSON 문자열로 두고 출처를 밝히는 필드를 함께 넣는다.

## 함께 쓰는 표현
- **escape character** : 이스케이프 문자 (`\` 등)
- **escape the delimiter** : 구분자 밖으로 빠져나가다 (= *breakout*)

## 시험 포인트
본문에 닫는 태그를 넣어 데이터 영역을 **빠져나가는** 공격은, 본문을 **이스케이프된 JSON 문자열**로 감싸 tool_result 안에 두고 출처 필드를 붙여 막습니다. 구분자를 바꾸거나 특정 문자를 지우는 것은 근본 해결이 아닙니다.
