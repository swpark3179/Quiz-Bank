나쁜 일이 **일어나기 전에 미리 막는** 것입니다. 이미 생긴 일을 찾아내는 *detect* 와 대비됩니다.

## 문제 속 쓰임
> An engineer wants to **prevent** Claude Code from running `rm -rf` or `git push --force` commands under any circumstances, even if asked.
> 엔지니어가 Claude Code가 어떤 상황에서도, 요청을 받더라도 `rm -rf` 나 `git push --force` 를 **실행하지 못하게** 하려고 한다.

## 함께 쓰는 표현
- **prevent A from -ing** : A가 ~하지 못하게 막다
- **prevention** (명) 예방, 방지

## 비교
- **prevent** — 사전에 막음 · **detect** — 사후에 찾아냄

## 시험 포인트
"무엇이 이를 **예방**했을까"에는 사후 로깅·감사가 아니라 실행 전에 막는 장치(사람 승인 게이트, `settings.json` deny 규칙, PreToolUse 훅)가 정답입니다.
