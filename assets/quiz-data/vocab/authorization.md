1. **인가, 권한 부여** — 누구인지 확인된 뒤 **무엇을 해도 되는지** 허락하는 것입니다. *unauthorized* 는 '허가받지 않은, 무단의'
2. **Authorization 헤더** — HTTP 요청에 토큰 같은 자격 증명을 실어 보내는 헤더입니다. 이름과 달리 실제로는 인증 정보를 담습니다

## 문제 속 쓰임
> The PreToolUse hook consequently allowed `process_refund`, resulting in an **unauthorized** refund.
> 그 결과 PreToolUse 훅이 `process_refund`를 허용해 **무단** 환불이 발생했다.

> Add the server with --scope project, set the header to "**Authorization**: Bearer ${GITHUB_TOKEN}" in .mcp.json...
> `--scope project`로 서버를 추가하고, `.mcp.json`에서 헤더를 "**Authorization**: Bearer ${GITHUB_TOKEN}"으로 설정한다...

## 함께 쓰는 표현
- **authorize** : 인가하다, 승인하다
- **unauthorized access** : 무단 접근

## 시험 포인트
*unauthorized* 환불을 막는 정답은 바뀔 수 있는 별도 플래그 대신 **도구 입력(`tool_input`)에 담긴 명시적 확인 결과**를 PreToolUse 훅이 검사하는 것입니다. 팀이 공유하는 MCP 설정에서는 *Authorization* 헤더에 토큰을 직접 쓰지 않고 `${GITHUB_TOKEN}` 처럼 환경 변수로 채웁니다.
