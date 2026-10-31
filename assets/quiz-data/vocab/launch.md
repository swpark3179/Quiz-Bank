1. **출시, 정식 공개** — 제품·서비스를 사용자에게 처음 내놓는 것 (*before launch* 출시 전)
2. **(프로그램을) 시작하다, 실행하다** — 앱이나 세션을 띄우는 것. *at launch* 는 '시작할 때, 시작 시점에'

## 문제 속 쓰임
> A team is reviewing an MCP tool's error contract before **launch**.
> **출시** 전 한 팀이 MCP 도구의 오류 계약을 검토합니다.

> To reduce the context used at **launch**, a team moves the frontend and database sections of its 300-line root CLAUDE.md into docs/frontend.md and docs/db.md.
> **시작 시** 컨텍스트 사용량을 줄이려고, 300줄짜리 루트 CLAUDE.md의 프런트엔드·DB 섹션을 `docs/frontend.md` 와 `docs/db.md` 로 옮겼습니다.

## 함께 쓰는 표현
- **before launch** : 출시 전
- **at launch** : 시작할 때 (세션·앱이 뜰 때)
- **launch a session / process** : 세션·프로세스를 띄우다

## 시험 포인트
`@` 로 가져온 파일은 루트 CLAUDE.md 와 함께 **시작 시(*at launch*) 모두 로드**되므로 컨텍스트가 줄지 않습니다. 필요할 때만 로드되는 것은 하위 디렉터리 CLAUDE.md 와 `paths` 가 지정된 규칙입니다.
