1. **(Docker 등의) 컨테이너** — 앱과 필요한 실행 환경을 묶어 격리된 상태로 돌리는 단위
2. **그릇, 담는 것** — 일반적인 뜻

## 문제 속 쓰임
> Reproduce the author's local machine environment, including home-directory config, inside the CI job **container**
> 홈 디렉터리 설정을 포함한 작성자의 로컬 머신 환경을 CI job **컨테이너** 안에 그대로 재현한다

## 함께 쓰는 표현
- **container image** : 컨테이너를 만드는 이미지
- **run in a container** : 컨테이너 안에서 실행하다
- **containerized** (형) 컨테이너로 만든

## 시험 포인트
CI의 깨끗한 체크아웃에서 팀 규칙이 안 먹힌다면 컨테이너에 개인 환경을 복제할 것이 아니라, 규칙을 **커밋되는 프로젝트 `.claude/CLAUDE.md`** 로 옮기는 것이 정답입니다.
