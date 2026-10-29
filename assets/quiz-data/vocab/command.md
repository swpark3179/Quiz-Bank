컴퓨터에 내리는 **명령(어)** 입니다. Claude Code 에서는 셸 명령(`rm -rf`)과 `/` 로 시작하는 **슬래시 커맨드** 둘 다를 가리킵니다.

## 문제 속 쓰임
> Create a custom slash **command** `/lint` that the developer runs manually after edits
> 개발자가 편집 후 수동으로 실행하는 `/lint` 커스텀 슬래시 **커맨드**를 만든다

## 함께 쓰는 표현
- **slash command** : `/` 로 시작하는 Claude Code 명령
- **shell command** : 터미널(셸) 명령

## 시험 포인트
슬래시 커맨드는 **사람이 실행해야만** 동작합니다. "편집할 때마다 반드시"라면 `PostToolUse` 훅처럼 자동 실행되는 장치가 정답입니다. 팀 공용 커맨드는 저장소의 `.claude/commands/` 에 커밋해 공유합니다.
