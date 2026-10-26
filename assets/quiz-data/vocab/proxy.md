1. **(요청을) 대신 전달하다 / 중계 서버** — 클라이언트와 실제 서버 사이에서 요청을 받아 넘겨 주는 것
2. **대리(인), 대용 지표** — 직접 재기 어려운 것을 대신 나타내는 것 (*a proxy for quality*)

## 문제 속 쓰임
> Create an MCP server wrapper that reads tokens from a `.env` file and **proxies** requests to the GitHub API.
> `.env` 파일에서 토큰을 읽어 GitHub API로 요청을 **대신 전달하는** MCP 래퍼 서버를 만든다.

## 함께 쓰는 표현
- **proxy server** : 프록시(중계) 서버
- **proxy requests to** ~ : 요청을 ~로 중계하다
- **by proxy** : 대리로

## 시험 포인트
내장 기능(예: 환경 변수 확장)으로 해결되는 문제에 **프록시 래퍼 서버를 직접 만드는** 보기는 과도한 설계라 오답이 되기 쉽습니다.
