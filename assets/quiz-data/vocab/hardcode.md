값이나 구성을 설정·환경 변수·입력으로 받지 않고 **코드(설정 파일)에 직접 고정해 적는** 것입니다. 바꾸려면 코드를 고쳐야 하고, 비밀값이면 **유출 위험**이 됩니다. *hard-code* 처럼 하이픈을 넣어 쓰기도 합니다.

## 문제 속 쓰임
> A security scan flags that the team's committed .mcp.json contains a **hardcoded** GitHub personal-access token used by an MCP server.
> 보안 스캔 결과, 팀이 커밋한 `.mcp.json` 에 MCP 서버가 쓰는 GitHub 개인 액세스 토큰이 **하드코딩되어** 있다는 경고가 나왔다.

## 함께 쓰는 표현
- **hardcoded token / credential** : 코드에 박힌 토큰·자격 증명
- **hard-code a decomposition** : 작업 분할을 미리 고정해 두다

## 시험 포인트
공유 `.mcp.json` 에 비밀값이 필요하면 `${GITHUB_TOKEN}` 같은 **환경 변수 확장**으로 각자 값을 주입하는 것이 정답입니다. 구조를 모르는 코드베이스를 **하드코딩한 고정 분할**로 나누면 빠지는 영역이 생기므로, 먼저 탐색한 뒤 동적으로 나누는 보기가 정답입니다.
