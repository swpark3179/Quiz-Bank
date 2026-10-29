**개인 계정에 묶인 접근 토큰**입니다. 유출되면 그 사람의 권한이 그대로 넘어가므로 코드·설정 파일에 넣지 않습니다.

## 문제 속 쓰임
> ...the team's committed .mcp.json contains a hardcoded GitHub **personal-access token** used by an MCP server.
> 팀이 커밋한 `.mcp.json` 에 MCP 서버가 쓰는 GitHub **개인 액세스 토큰**이 하드코딩되어 있다.

## 함께 쓰는 표현
- **PAT** : personal access token 의 줄임말
- **hardcoded token** : 코드·설정에 그대로 박아 둔 토큰

## 시험 포인트
공유 `.mcp.json` 에 비밀값이 필요하면 `${GITHUB_TOKEN}` 같은 **환경 변수 확장**으로 각 머신·CI 가 자기 값을 넣게 하는 보기가 정답입니다.
