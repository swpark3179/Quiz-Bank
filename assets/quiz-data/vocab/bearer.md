'지니고 있는 사람'이라는 뜻에서 나온 말로, **Bearer 토큰**은 따로 신원을 증명하지 않아도 **토큰을 가진 쪽이면 누구나 쓸 수 있는** 접근 토큰입니다. 그래서 유출되면 그대로 악용될 수 있어 공유 파일에 값을 직접 적지 않습니다.

## 문제 속 쓰임
> Add the server with --scope project, set the header to "Authorization: **Bearer** ${GITHUB_TOKEN}" in .mcp.json, and have each engineer export GITHUB_TOKEN in their own shell
> `--scope project`로 서버를 추가하고, `.mcp.json`에서 헤더를 "Authorization: **Bearer** ${GITHUB_TOKEN}"으로 설정한 뒤, 엔지니어마다 자기 셸에서 GITHUB_TOKEN을 export한다

## 함께 쓰는 표현
- **Bearer token** : 소지자 토큰 (가진 쪽이 곧 권한자)
- **Authorization: Bearer** … : 토큰을 실어 보내는 헤더 형식
- **personal access token** : 개인 액세스 토큰 (PAT)

## 시험 포인트
팀이 공유하는 `.mcp.json` 에는 *Bearer* 토큰 값 대신 `${GITHUB_TOKEN}` 같은 **환경 변수 확장**을 쓰고, 각자 자기 셸에서 값을 채웁니다. 실제 토큰을 `${VAR:-기본값}` 의 기본값으로 적는 보기는 결국 비밀값을 커밋하는 셈이라 오답입니다.
