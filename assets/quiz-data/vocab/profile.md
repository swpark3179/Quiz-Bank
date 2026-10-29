한 사용자·계정에 딸린 **설정과 정보의 묶음**입니다. 문제에서는 한 사람(리드)의 개인 환경에 있는 설정을 가리킵니다.

## 문제 속 쓰임
> ...so the user-scoped memory files are force-reloaded from the lead's **profile**
> 사용자 범위 메모리 파일을 리드의 **프로필**에서 강제로 다시 불러오게 한다.

## 함께 쓰는 표현
- **user profile** : 사용자 프로필
- **shell profile** : 셸 시작 설정 파일 (`~/.bash_profile` 등)

## 시험 포인트
"내 머신에선 되는데 팀원은 안 된다"면 사용자 범위(`~/.claude/`)에 둔 설정이 원인입니다. 팀 공유가 목적이면 **커밋되는 프로젝트 범위 `CLAUDE.md`** 가 정답입니다.
