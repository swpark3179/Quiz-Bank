**symbolic link** 의 줄임말로, 실제 파일 대신 **다른 파일의 위치를 가리키는 바로 가기 파일**입니다. 동사로 "심볼릭 링크를 걸다"로도 씁니다 (`ln -s`).

## 문제 속 쓰임
> Split CLAUDE.md into two files and **symlink** the right one into place per job before each run starts
> CLAUDE.md를 두 파일로 나누고, 매 실행이 시작되기 전에 job별로 맞는 파일을 **심볼릭 링크로** 배치한다

## 함께 쓰는 표현
- **symlink A to B** : A가 B를 가리키게 링크를 걸다
- **hard link** : 하드 링크 — 같은 파일 데이터를 가리키는 또 하나의 이름

## 시험 포인트
특정 작업에만 필요한 내용 때문에 CLAUDE.md 가 비대해졌다면, 파일을 바꿔 끼우는(symlink) 꼼수가 아니라 그 내용을 **온디맨드 스킬**(`.claude/skills/`)로 옮기는 것이 정답입니다.
