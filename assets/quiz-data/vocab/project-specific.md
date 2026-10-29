다른 곳에는 해당하지 않고 **그 프로젝트(저장소)에만 해당하는** 것입니다. Claude Code 설정에서는 사용자 개인 설정과 구분되는 **프로젝트 범위**를 떠올리게 합니다.

## 문제 속 쓰임
> A team wants **project-specific** commands available to all engineers using Claude Code on the repo, without adding entries to each engineer's user settings.
> 팀은 저장소에서 Claude Code를 쓰는 모든 엔지니어가 **프로젝트 전용** 커맨드를 쓸 수 있길 원한다. 단, 각 엔지니어의 사용자 설정에 항목을 추가하지 않고서.

## 함께 쓰는 표현
- **project-specific settings** : 프로젝트 전용 설정
- **-specific** (접미) ~ 전용의, ~에 한정된 (*tool-specific*, *language-specific*)

## 시험 포인트
팀 전체가 쓸 커스텀 커맨드는 저장소의 **`.claude/commands/`** 에 마크다운 파일로 만들어 커밋하는 보기가 정답입니다. 사용자 설정(`~/.claude/`)은 팀원과 공유되지 않습니다.
