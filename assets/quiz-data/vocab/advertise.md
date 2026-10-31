1. **(기능·정보를) 알리다, 내보이다** — 프로토콜에서 "나는 이런 기능을 지원한다"고 상대에게 선언하는 것입니다
2. **광고하다** — 상품·서비스를 널리 알리는 일상적인 뜻입니다

## 문제 속 쓰임
> A team's MCP server has a working `tools/call` handler, but the `capabilities` object it **advertises** (for example, in its `server/discover` result) contains only `resources`.
> 한 팀의 MCP 서버는 동작하는 `tools/call` 핸들러를 갖고 있지만, 서버가 **알리는** `capabilities` 객체에는 `resources`만 들어 있다.

## 함께 쓰는 표현
- **advertise a capability** : 지원 기능을 선언해 알리다
- **advertised capabilities** : 상대에게 공개한 지원 기능 목록

## 비슷한 말 · 반대말
- **declare** — 선언하다 (명세에서 함께 쓰는 말)

## 시험 포인트
MCP는 기능 협상을 씁니다. 핸들러를 구현했어도 `tools` 기능을 *advertise* 하지 않으면 클라이언트는 그 도구를 쓸 수 없으므로, "구현했으니 선언은 선택"이라는 보기는 오답입니다.
