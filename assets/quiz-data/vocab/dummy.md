**실제 의미는 없고 자리나 형식을 채우려고 넣는 가짜 값·대상**입니다. 테스트용 가짜 데이터(*dummy data*)나, 규칙을 맞추려고 억지로 넣는 매개변수를 가리킵니다.

## 문제 속 쓰임
> It is invalid, because every tool must declare at least one required property, so a **dummy** parameter is needed.
> 유효하지 않다. 모든 도구는 필수 속성을 하나 이상 선언해야 하므로 **더미(가짜)** 매개변수가 필요하다.

## 함께 쓰는 표현
- **dummy parameter** : 형식만 채우는 가짜 매개변수
- **dummy data** : 테스트용 가짜 데이터

## 비슷한 말 · 반대말
- **placeholder** — 나중에 채울 자리 표시
- **mock** — 테스트에서 진짜를 흉내 내는 대역

## 시험 포인트
인자 없는 MCP 도구에 *dummy* 매개변수는 필요 없습니다. `inputSchema` 는 `null` 이 될 수 없고, `{"type": "object", "additionalProperties": false}` 같은 **객체 스키마**를 쓰면 됩니다.
