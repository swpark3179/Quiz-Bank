어떤 일이 벌어지는 **상황·사정**입니다. 거의 복수형 *circumstances* 로 씁니다.

## 문제 속 쓰임
> An engineer wants to prevent Claude Code from running `rm -rf` or `git push --force` commands under any **circumstances**, even if asked.
> 엔지니어가 Claude Code가 **어떤 상황에서도**, 요청을 받더라도 `rm -rf` 나 `git push --force` 를 실행하지 못하게 하려고 합니다.

## 함께 쓰는 표현
- **under any circumstances** : 어떤 상황에서도
- **under no circumstances** : 어떤 경우에도 ~않다

## 시험 포인트
"under any circumstances"는 **결정적 강제**가 필요하다는 신호입니다. `settings.json` 의 deny 규칙이나 `PreToolUse` 훅, 도구 목록 제한이 정답이고, CLAUDE.md·시스템 프롬프트에 "절대 하지 마라"고 쓰는 보기는 오답입니다.
