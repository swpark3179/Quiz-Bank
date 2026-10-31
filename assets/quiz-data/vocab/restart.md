멈추거나 끝난 것을 **처음부터 다시 시작하는** 것입니다. 멈춘 지점부터 이어 가는 *resume* 과 달리, 기존 상태를 버리고 새로 켜는 느낌이 있습니다.

## 문제 속 쓰임
> Ask the teammate to **restart** Claude Code so it scans for new skills again
> 팀원에게 Claude Code 를 **재시작**해 새 스킬을 다시 스캔하게 한다.

## 함께 쓰는 표현
- **restart the session / app** : 세션·앱을 다시 시작하다
- **restart from scratch** : 처음부터 다시 하다

## 비슷한 말 · 반대말
- **resume** — 멈춘 곳에서 이어 하다
- **reload** — 다시 불러오다

## 시험 포인트
이 보기는 오답입니다. 스킬이 개인 `~/.claude/skills/` 에만 있어 **팀원 머신에는 파일 자체가 없으므로** 재시작해도 찾을 것이 없습니다. 저장소 `.claude/skills/` 에 두고 커밋해야 하며, Claude Code 는 스킬 디렉터리 변경을 감시해 같은 세션에서도 새 스킬을 반영합니다.
