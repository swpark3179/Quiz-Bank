1. **(git) 커밋하다** — 변경 내용을 저장소 기록에 확정해 남기다. 명사로는 '커밋'
2. **(~로) 확정하다, 전념하다** — *commit to* ~ : 한 방식으로 정하고 밀고 나가다

## 문제 속 쓰임
> You want consistent tooling across the team without **committing** credentials to version control.
> 자격 증명을 버전 관리에 **커밋하지** 않으면서 팀 전체에 일관된 도구를 제공하고 싶다.
> ...brainstorm and evaluate different implementation approaches before **committing** to one.
> 하나로 **확정하기** 전에 여러 구현 방식을 브레인스토밍하고 평가한다.

## 함께 쓰는 표현
- **commit credentials / secrets** : 자격 증명·비밀 값을 저장소에 올리다 (보안상 피해야 함)
- **commit to an approach** : 한 방식으로 정하다
- **commitment** (명) 약속, 전념

## 시험 포인트
팀이 공유할 설정은 커밋하되 **비밀 값은 커밋하지 않는** 것이 원칙입니다. 프로젝트 `.mcp.json` 에 `${GITHUB_TOKEN}` 같은 환경 변수 확장을 쓰면 두 조건을 함께 만족합니다.
