함부로 드러나거나 잘못 다뤄지면 **피해가 생길 수 있어 특별히 조심해야 하는** 상태를 말합니다. 보안 문제에서 이 말이 나오면 접근을 더 좁게 막으라는 신호입니다.

## 문제 속 쓰임
> A security lead wants Claude Code to see no MCP tools from any server while working in a **sensitive** repository.
> 보안 책임자는 **민감한** 저장소에서 작업할 때 Claude Code 가 어떤 서버의 MCP 도구도 보지 못하기를 원한다.

## 함께 쓰는 표현
- **sensitive data** : 민감 정보
- **sensitive access** : 민감한 자원에 대한 접근
- **case-sensitive** : 대소문자를 구분하는

## 비슷한 말 · 반대말
- **confidential** — 기밀의 (비슷한 뜻)
- **public** — 공개된

## 시험 포인트
모든 MCP 도구를 **보지도 못하게** 하려면 `permissions.deny` 에 `"mcp__*"` 를 넣습니다. deny 는 도구를 컨텍스트에서 제거하지만, `ask` 는 호출마다 묻기만 하고 `allow` 에서는 이런 넓은 글롭이 무시됩니다.
