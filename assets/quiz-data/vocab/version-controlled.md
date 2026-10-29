파일이 git 같은 **버전 관리 시스템에 커밋되어** 변경 이력이 남고 팀이 함께 쓰는 상태입니다.

## 문제 속 쓰임
> The team wants the server config to stay shared and **version-controlled**, but each engineer (and CI) must supply their own credential without leaking it.
> 팀은 서버 설정을 계속 공유하고 **버전 관리하기**를 원하지만, 각 엔지니어(와 CI)는 유출 없이 각자의 자격 증명을 제공해야 한다.

## 함께 쓰는 표현
- **version control** : 버전 관리 · **VCS** 버전 관리 시스템
- **check into version control** : 버전 관리에 등록(커밋)하다

## 시험 포인트
"공유·버전 관리 + 비밀값은 각자"라는 조건이면 프로젝트 스코프 **`.mcp.json` 에 `${GITHUB_TOKEN}` 같은 환경 변수 참조**를 두는 보기가 정답입니다. 사용자 스코프(`~/.claude.json`)는 공유되지 않습니다.
