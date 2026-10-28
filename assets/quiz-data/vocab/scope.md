1. **(작업·검토가 다루는) 범위** — 무엇까지 포함하고 어디서 멈출지의 경계
2. **(설정이 적용되는) 범위** — Claude Code 의 MCP 설정처럼 *user* / *project* / *local* 중 어디에 두어 누구에게 적용할지

## 문제 속 쓰임
> Restrict the review **scope** to only files modified in the most recent push.
> 리뷰 **범위**를 최근 푸시에서 수정된 파일로만 제한한다.
> Have each developer configure the server in user **scope** with `claude mcp add --scope user`.
> 각 개발자가 `claude mcp add --scope user` 로 서버를 사용자 **범위**에 설정하게 한다.

## 함께 쓰는 표현
- **in scope / out of scope** : 범위 안 / 범위 밖
- **scope creep** : 작업 범위가 계획 없이 계속 불어나는 것
- **scoped** (형) 범위를 한정한 — *a scoped tool* 필요한 일만 하도록 좁힌 도구

## 시험 포인트
팀 전체가 같은 설정을 써야 하면 버전 관리되는 **project scope**(`.mcp.json`)가 맞고, 개인 비밀값은 환경 변수로 넣습니다. 또 *scoped* 도구는 최소 권한 원칙과 연결되는 신호입니다.
