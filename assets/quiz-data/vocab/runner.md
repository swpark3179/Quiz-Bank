작업을 실제로 **돌려 주는 실행기**입니다. CI 에서는 파이프라인의 job 을 받아 실행하는 서버·프로세스(GitHub Actions runner 등)를 가리킵니다.

## 문제 속 쓰임
> Add the conventions to the CI build server's `~/.claude/CLAUDE.md` so the **runner** picks them up on each job
> CI 빌드 서버의 `~/.claude/CLAUDE.md` 에 컨벤션을 추가해, **러너**가 job마다 이를 읽게 한다

## 함께 쓰는 표현
- **CI runner** : CI 러너
- **test runner** : 테스트 실행기 (Jest, pytest 등)
- **self-hosted runner** : 직접 운영하는 러너

## 시험 포인트
`~/.claude/CLAUDE.md` 는 그 머신 사용자만의 설정이라 **버전 관리되지 않습니다**. 팀 컨벤션은 저장소에 커밋한 프로젝트 `.claude/CLAUDE.md` 에 두어야 로컬·CI 의 모든 체크아웃에서 똑같이 로드됩니다.
