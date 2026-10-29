프로그램이 돌아가는 **실행 환경** — 머신, OS, 설치된 도구, 설정값, 환경 변수 같은 조건 전체를 말합니다.

## 문제 속 쓰임
> Configure commands via **environment** variables in the CI pipeline
> CI 파이프라인의 **환경** 변수로 커맨드를 설정한다
> Reproduce the author's local machine **environment**, including home-directory config, inside the CI job container
> 홈 디렉터리 설정을 포함한 작성자의 로컬 머신 **환경**을 CI job 컨테이너 안에 그대로 재현한다

## 함께 쓰는 표현
- **environment variable** : 환경 변수 — 비밀값·설정을 코드 밖에서 넣는 방법
- **production / staging environment** : 운영 / 스테이징 환경

## 시험 포인트
CI 에서 개인 머신의 `~/.claude/` 설정이 적용되지 않는다면, 개인 **환경을 재현하기보다** 저장소에 커밋되는 프로젝트 설정(`CLAUDE.md`, `.claude/`)으로 옮기는 것이 정답입니다.
