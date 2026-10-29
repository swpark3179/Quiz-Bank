1. **(보안·오류를) 훑어 검사하다, 스캔** — 코드·설정에서 비밀값·취약점을 자동으로 찾는 것
2. **(종이 문서를) 스캔하다** — *scanned documents* 는 스캐너로 찍은 이미지 문서

## 문제 속 쓰임
> A security **scan** flags that the team's committed .mcp.json contains a hardcoded GitHub personal-access token used by an MCP server.
> 보안 **스캔** 결과, 팀이 커밋한 `.mcp.json` 에 MCP 서버가 쓰는 GitHub 개인 액세스 토큰이 하드코딩되어 있다는 경고가 나왔습니다.

## 함께 쓰는 표현
- **security scan / secret scanning** : 보안 스캔 / 비밀값 스캔
- **scanned PDF** : 스캔한 PDF

## 시험 포인트
`.mcp.json` 에는 토큰 대신 **`${GITHUB_TOKEN}` 같은 환경 변수 참조**를 커밋하면 설정은 공유하고 값은 각자 주입할 수 있습니다. 또 스캔 문서에서 정보가 아예 잘려 없다면 재시도로는 복구되지 않으므로 **null 로 두고 사람 검토로** 넘기는 것이 정답입니다.
