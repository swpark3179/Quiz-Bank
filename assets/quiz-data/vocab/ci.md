**Continuous Integration(지속적 통합)** 의 줄임말입니다. 커밋·PR 마다 빌드와 테스트를 자동으로 돌리는 파이프라인으로, 사람이 지켜보지 않는 **비대화형 환경**입니다.

## 문제 속 쓰임
> The team wants the server config to stay shared and version-controlled, but each engineer (and **CI**) must supply their own credential without leaking it.
> 팀은 서버 설정을 계속 공유하고 버전 관리하기를 원하지만, 각 엔지니어(와 **CI**)는 유출 없이 각자의 자격 증명을 제공해야 합니다.

## 함께 쓰는 표현
- **CI pipeline / job** : CI 파이프라인 / 작업 단위
- **CI/CD** : 지속적 통합 / 지속적 배포

## 시험 포인트
CI 에서 Claude Code 는 `-p`(print) 모드로 비대화형 실행합니다. CI 에는 개인 홈 설정(`~/.claude/`)이 없으므로 공유 지침은 **커밋되는 프로젝트 파일**에, 비밀값은 `.mcp.json` 의 `${ENV_VAR}` 참조로 넣습니다.
