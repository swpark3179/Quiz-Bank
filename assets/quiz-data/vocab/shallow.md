깊이가 얕다는 뜻으로, git 에서는 *shallow clone* · *shallow fetch* 처럼 **최근 커밋 몇 개만 받아 와 이력이 짧은 상태**를 말합니다. CI 에서 체크아웃 시간을 줄이려고 자주 씁니다.

## 문제 속 쓰임
> The checkout used a **shallow** fetch-depth, so the CLI could not resolve the diff against the base branch...
> checkout 이 **얕은** fetch-depth 를 써서 CLI 가 기준 브랜치와의 diff 를 구하지 못했다...

## 함께 쓰는 표현
- **shallow clone** : 최근 이력만 받은 복제
- **fetch-depth** : 가져올 커밋 이력의 깊이
- **shallow copy** : (프로그래밍) 얕은 복사 — 안쪽 객체는 원본과 공유하는 복사

## 비슷한 말 · 반대말
- **deep / full clone** — 전체 이력을 받은 복제

## 시험 포인트
이 보기는 오답입니다. 얕은 클론은 쓸 수 있는 이력을 제한할 뿐, Claude Code 가 빠진 커밋을 찾느라 멈추지는 않습니다. CI 에서 출력 없이 멈췄다면 `-p` 없이 **대화형 세션**이 열려 입력을 기다린 것입니다.
