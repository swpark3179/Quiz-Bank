파일을 묶어 두는 **폴더(경로)** 입니다. 문제에서는 `.claude/commands/`, `docs/` 처럼 **파일을 어느 위치에 두느냐**가 적용 범위를 정하는 맥락으로 나옵니다.

## 문제 속 쓰임
> Create markdown files in `.claude/commands/` **directory** in the repo root and commit them
> 저장소 루트의 `.claude/commands/` **디렉터리**에 마크다운 파일을 만들고 커밋한다

## 함께 쓰는 표현
- **root directory** : 최상위 디렉터리 (*repo root*)
- **home directory** : 사용자 홈 디렉터리 (`~`)
- **subdirectory** : 하위 디렉터리

## 시험 포인트
저장소 안 `.claude/commands/` 에 두고 커밋하면 **팀 전체**가 같은 커맨드를 쓰고, 홈 디렉터리 `~/.claude/` 에 두면 **나 혼자만** 씁니다. 공유가 목적이면 프로젝트 쪽 디렉터리가 정답입니다.
