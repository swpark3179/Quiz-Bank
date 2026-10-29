**사선(/) 기호**입니다. Claude Code 에서는 `/` 로 시작하는 명령인 *slash command*(예: `/compact`, `/clear`)로 주로 나옵니다.

## 문제 속 쓰임
> Create a custom **slash command** `/lint` that the developer runs manually after edits
> 개발자가 편집 후 수동으로 실행하는 `/lint` 커스텀 **슬래시 커맨드**를 만든다

## 함께 쓰는 표현
- **custom slash command** : 직접 만든 슬래시 명령 — 프로젝트의 `.claude/commands/` 에 두면 팀이 공유
- **backslash** : 역슬래시(\)

## 시험 포인트
슬래시 커맨드는 **사람이 직접 불러야** 실행됩니다. "파일을 수정할 때마다 **자동으로**" 무언가를 해야 한다면 `PostToolUse` 같은 **훅**이 정답입니다.
